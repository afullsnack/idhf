import AboutSection from '@/components/about-section'
import EventsSection from '@/components/events-section'
import HeroCarousel from '@/components/hero-carousel'
import InauguralSection from '@/components/inaugural-section'
import NewsLetterModal from '@/components/newletter-modal'
import ValuesSection from '@/components/values-section'
import { getArtifacts, getEvents, getHeroSlides, getInductees } from '@/functions/frontend.functions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Idoma Hall of Fame',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [heroSlides, inductees, artifacts, events] = await Promise.all([
    getHeroSlides(),
    getInductees(),
    getArtifacts(),
    getEvents(),
  ])

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <AboutSection inductees={inductees} artifacts={artifacts} />
      <ValuesSection />
      {/* YouTube promo section intentionally skipped */}
      <InauguralSection inductees={inductees} />
      <EventsSection events={events} />
      <NewsLetterModal />
    </>
  )
}