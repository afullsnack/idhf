import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isCloudflareWorkers } from '@/lib/cloudflare'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { HeroSlides } from './collections/HeroSlides'
import { Inductees } from './collections/Inductees'
import { Artifacts } from './collections/Artifacts'
import { Events } from './collections/Events'

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
  db: isCloudflareWorkers()
    ? (undefined as never)
    : (await import('@payloadcms/db-sqlite')).sqliteAdapter({
        client: {
					url: process.env.DATABASE_URL || '',
	        authToken: process.env.DATABASE_AUTH_TOKEN || ''
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
