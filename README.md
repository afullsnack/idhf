# Idoma Hall of Fame

The main website for the Idoma Hall of Fame, built with [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org).

## Stack

- **Payload CMS** `3.90.2` (admin, REST + GraphQL APIs) on **Next.js** `16.3.6`
- **Postgres** via `@payloadcms/db-postgres` (single adapter for all environments)
- **Vercel Blob** via `@payloadcms/storage-vercel-blob` for uploaded media
- Frontend styled with **Tailwind CSS** + shadcn/ui-style components, data via **TanStack Query**

## Development

1. Copy the environment file and fill in the required values:

   ```bash
   cp .env.example .env
   ```

   - `PAYLOAD_SECRET` — long random string used by Payload
   - `PROD_DATABASE_URL` — your Postgres connection string (e.g. Neon)
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (required for media uploads)
   - `PLUNK_API_KEY` — Plunk API key for newsletter signups

2. Install and run:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Open `http://localhost:3000` for the site and `http://localhost:3000/admin` for the Payload panel.

Then create your first admin user and start adding content.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Create an optimized production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm run generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm run generate:importmap` | Regenerate the admin import map |
| `pnpm test` | Run integration and e2e tests |

## Database migrations

Schema changes are applied explicitly, never auto-pushed to the shared database:

```bash
pnpm payload migrate:create   # create a new migration from config changes
pnpm payload migrate          # run pending migrations
```

Existing migrations live in `src/migrations/` and are registered via `prodMigrations`.