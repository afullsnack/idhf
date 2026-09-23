import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  preset: 'cloudflare-module',
  compatibilityDate: '2026-09-23',
  output: {
    dir: 'dist',
  },
})