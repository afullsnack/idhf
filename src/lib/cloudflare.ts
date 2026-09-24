type CloudflareWorkerEnv = {
  // Hyperdrive binding. When present, `connectionString` points at the cached,
  // pooled Postgres connection. See https://developers.cloudflare.com/hyperdrive/
  HYPERDRIVE?: {
    connectionString?: string
  }
}

/**
 * Detect whether the current process is a Cloudflare Worker.
 *
 * `CF_WORKER` is exposed as a `vars` entry in `wrangler.jsonc`, so it is
 * available on `process.env` (via `nodejs_compat`) as soon as the isolate
 * boots. Nitro also stashes the request `env` on `globalThis.__env__` for the
 * duration of each request, which we use as a secondary signal.
 */
export function isCloudflareWorkers() {
  if (process.env.CF_WORKER === '1') return true
  return (globalThis as { __env__?: unknown }).__env__ !== undefined
}

/**
 * Resolve the production Postgres connection string.
 *
 * Priority:
 *  1. The `HYPERDRIVE` Workers binding (cached + pooled, recommended in prod).
 *  2. `HYPERDRIVE_URL` env var (fallback for local `wrangler dev`).
 *  3. `DATABASE_URL` env var (direct Postgres, e.g. when running Payload CLI
 *     like migrations from Node against the production database).
 */
export function getHyperdriveConnectionString(): string {
  const env = (globalThis as CloudflareWorkerEnv & { __env__?: CloudflareWorkerEnv }).__env__
  return (
    env?.HYPERDRIVE?.connectionString ||
    process.env.HYPERDRIVE_URL ||
    process.env.DATABASE_URL ||
    ''
  )
}