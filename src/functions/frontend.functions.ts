import { createServerFn } from '@tanstack/react-start'
import { getHyperdriveConnectionString, isCloudflareWorkers } from '@/lib/cloudflare'
import type { Artifact, Event as EventItem, HeroSlide, Inductee } from '@/payload-types'

export const getHeroSlides = createServerFn({ method: 'GET' }).handler(async () => {
  if (isCloudflareWorkers() && !getHyperdriveConnectionString()) return []

  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'hero-slides',
    draft: false,
    overrideAccess: false,
    sort: 'order',
    depth: 1,
    pagination: false,
  })

  return docs as HeroSlide[]
})

export const getInductees = createServerFn({ method: 'GET' }).handler(async () => {
  if (isCloudflareWorkers() && !getHyperdriveConnectionString()) return []

  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'inductees',
    draft: false,
    overrideAccess: false,
    sort: '-createdAt',
    depth: 1,
    pagination: false,
    limit: 12,
  })

  return docs as Inductee[]
})

export const getArtifacts = createServerFn({ method: 'GET' }).handler(async () => {
  if (isCloudflareWorkers() && !getHyperdriveConnectionString()) return []

  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'artifacts',
    draft: false,
    overrideAccess: false,
    sort: '-createdAt',
    depth: 1,
    pagination: false,
    limit: 10,
  })

  return docs as Artifact[]
})

export const getEvents = createServerFn({ method: 'GET' }).handler(async () => {
  if (isCloudflareWorkers() && !getHyperdriveConnectionString()) return []

  const config = (await import('@payload-config')).default
  const { getPayload } = await import('payload')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'events',
    draft: false,
    overrideAccess: false,
    sort: 'date',
    depth: 1,
    pagination: false,
    limit: 20,
  })

  return docs as EventItem[]
})
