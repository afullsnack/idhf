import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// import path from 'path'
import { buildConfig } from 'payload'
// import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { getHyperdriveConnectionString, isCloudflareWorkers } from '@/lib/cloudflare'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { HeroSlides } from './collections/HeroSlides'
import { Inductees } from './collections/Inductees'
import { Artifacts } from './collections/Artifacts'
import { Events } from './collections/Events'

const poolConfig = {
  // Resolved lazily at connect time so the Worker bindings (globalThis.__env__)
  // are populated — they don't exist yet when the config module first loads.
  get connectionString() {
    return getHyperdriveConnectionString()
  },
  // Connections cannot be shared between requests on Workers: each one starts a
  // fresh client through Hyperdrive. See the Cloudflare Payload-on-Workers post.
  maxUses: 1,
} as Parameters<typeof postgresAdapter>[0]['pool'] & { maxUses: number }

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Folders, Tags, HeroSlides, Inductees, Artifacts, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: './payload-types.ts',
  },
  // DB selection by runtime:
  //  - Cloudflare Worker -> Postgres via Hyperdrive binding (lazy, pooled).
  //  - `DB_ADAPTER=postgres` + `PROD_DATABASE_URL` -> Postgres from the Node CLI,
  //    used for `payload migrate` against the production database.
  //  - otherwise (local dev) -> SQLite.
  db: isCloudflareWorkers()
    ? postgresAdapter({ pool: poolConfig })
    : process.env.DB_ADAPTER === 'postgres'
      ? postgresAdapter({
          pool: {
            connectionString: process.env.PROD_DATABASE_URL || '',
          },
        })
      : sqliteAdapter({
          client: {
            url: process.env.DATABASE_URL || '',
            authToken: process.env.DATABASE_AUTH_TOKEN || '',
          },
        }),
  sharp,
  localization: {
    locales: ['en'],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
})
