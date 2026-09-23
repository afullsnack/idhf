export function isCloudflareWorkers() {
  return process.env.CF_WORKER === '1'
}
