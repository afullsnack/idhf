import configPromise from '@payload-config'
import type { Artifact, Event as EventItem, HeroSlide, Inductee } from '@/payload-types'
import { getPayload } from 'payload'

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const config = await configPromise
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
}

export async function getInductees(): Promise<Inductee[]> {
  const config = await configPromise
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
}

export async function getArtifacts(): Promise<Artifact[]> {
  const config = await configPromise
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
}

export async function getEvents(): Promise<EventItem[]> {
  const config = await configPromise
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
}