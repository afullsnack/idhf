export function isCloudflarePages() {
  return process.env.CF_PAGES === '1'
}