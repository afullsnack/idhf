import { withPayload } from '@payloadcms/tanstack-start'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
      resolve: {
        alias: [
          // Project `@/` → `src/` alias.
          {
            find: /^@\//,
            replacement: path.resolve(__dirname, 'src') + '/',
          },
          // Pin tslib to its ESM build; the UMD one breaks CJS interop at boot.
          {
            find: /^tslib$/,
            replacement: path.resolve(__dirname, 'node_modules', 'tslib', 'tslib.es6.mjs'),
          },
          // Stub the blob client upload handler out of the client bundle.
          {
            find: /^@payloadcms\/storage-vercel-blob\/client$/,
            replacement: path.resolve(__dirname, 'src', 'stubs', 'vercel-blob-client.ts'),
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
    { payloadConfigPath: path.resolve(__dirname, 'src', 'payload.config.ts') },
  ),
)
