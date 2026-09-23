import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { isCloudflarePages } from '@/lib/cloudflare'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { HeroSlides } from './collections/HeroSlides'
import { Inductees } from './collections/Inductees'
import { Artifacts } from './collections/Artifacts'
import { Events } from './collections/Events'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Folders, Tags, HeroSlides, Inductees, Artifacts, Events],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isCloudflarePages()
    ? (undefined as never)
    : (await import('@payloadcms/db-sqlite')).sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || '',
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
