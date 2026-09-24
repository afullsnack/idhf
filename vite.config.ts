import { withPayload } from '@payloadcms/tanstack-start'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Force react-select and its subpath entrypoints to their ESM builds. The
// bundled CJS prod build breaks under rolldown's interop (the
// `_taggedTemplateLiteral` helper becomes an object and crashes the admin
// SSR chunk on Cloudflare Workers). Same idea as the tslib ESM pin below.
const uiRequire = createRequire(import.meta.resolve('@payloadcms/ui'))
const reactSelectEsm = uiRequire.resolve('react-select').replace(/dist\/react-select\.cjs\.js$/, 'dist/react-select.esm.js')
const reactSelectCreatableEsm = uiRequire.resolve('react-select/creatable').replace(/creatable\/dist\/react-select-creatable\.cjs\.js$/, 'creatable/dist/react-select-creatable.esm.js')

export default defineConfig(
  withPayload(
    ({ pluginOptions, env }) => ({
      plugins: [
				rsc(pluginOptions.rsc),
        tailwindcss(),
        tanstackStart(pluginOptions.tanstackStart),
        nitro({ preset: env.command === 'serve' ? 'nitro-dev' : undefined }),
        viteReact(pluginOptions.react),
      ],
      // resolve: {
      //   alias: [
      //     // Project `@/` → `src/` alias.
      //     {
      //       find: /^@\//,
      //       replacement: path.resolve(__dirname, 'src') + '/',
      //     },
      //     // Pin tslib to its ESM build; the UMD one breaks CJS interop at boot.
      //     {
      //       find: /^tslib$/,
      //       replacement: path.resolve(__dirname, 'node_modules', 'tslib', 'tslib.es6.mjs'),
      //     },
      //     // Stub the blob client upload handler out of the client bundle.
      //     {
      //       find: /^@payloadcms\/storage-vercel-blob\/client$/,
      //       replacement: path.resolve(__dirname, 'src', 'stubs', 'vercel-blob-client.ts'),
      //     },
      //   ],
      // },
      resolve: {
        alias: [
          {
            find: /^react-select$/,
            replacement: reactSelectEsm,
          },
          {
            find: /^react-select\/creatable$/,
            replacement: reactSelectCreatableEsm,
          },
        ],
      },
      server: {
        port: 3000,
        warmup: {
					clientFiles: [
						'./src/app/_frontend/index.tsx',
						'./src/app/_frontend/donation.tsx',
						'./src/app/_frontend/portal.tsx',
            './src/app/__root.tsx',
            './src/app/_payload.tsx',
            './src/app/_payload/admin.index.tsx',
            './src/app/_payload/admin.$.tsx',
          ],
        },
      },
    }),
		{
			payloadConfigPath: `./src/payload.config.ts`
				// path.resolve(__dirname, 'src', 'payload.config.ts')
		},
  ),
)
