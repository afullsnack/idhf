import { postgresAdapter } from '@payloadcms/db-postgres'
import { BoldFeature, EXPERIMENTAL_TableFeature, IndentFeature, ItalicFeature, lexicalEditor, LinkFeature, OrderedListFeature, UnderlineFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { migrations } from './migrations'
import { plunkEmailAdapter } from './emails/plunk'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { HeroSlides } from './collections/HeroSlides'
import { Inductees } from './collections/Inductees'
import { Artifacts } from './collections/Artifacts'
import { Events } from './collections/Events'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        dashboard: {
          Component: '/admin/views/Dashboard',
        },
      },
    },
  },
  collections: [Users, Media, HeroSlides, Inductees, Artifacts, Events],
	editor: lexicalEditor({
		features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['hero-slides', 'inductees', 'artifacts', 'events'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Postgres — the production database is driven by `PROD_DATABASE_URL`.
  // `push: false` prevents dev servers from diffing/pushing schema changes to a
  // shared database; apply schema changes explicitly via `payload migrate`.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PROD_DATABASE_URL || '',
    },
    push: false,
    prodMigrations: migrations,
  }),
  email: plunkEmailAdapter({
    apiKey: process.env.PLUNK_API_KEY || '',
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@idomahalloffame.org',
    defaultFromName: process.env.EMAIL_FROM_NAME || 'Idoma Hall of Fame',
  }),
  sharp,
  localization: {
    locales: ['en'],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
