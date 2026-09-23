import HeroCarousel from '@/components/hero-carousel'
import NewsLetterModal from '@/components/newletter-modal'
import AboutSection from '@/components/about-section'
import ValuesSection from '@/components/values-section'
import InauguralSection from '@/components/inaugural-section'
import EventsSection from '@/components/events-section'
import { getArtifacts, getEvents, getHeroSlides, getInductees } from '@/functions/frontend.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend/')({
  loader: async () => {
    const [heroSlides, inductees, artifacts, events] = await Promise.all([
      getHeroSlides(),
      getInductees(),
      getArtifacts(),
      getEvents(),
    ])
    return { heroSlides, inductees, artifacts, events }
  },
  component: HomePage,
  head: () => ({
    meta: [{ title: 'Idoma Hall of Fame' }],
  }),
})

function HomePage() {
  const { heroSlides, inductees, artifacts, events } = Route.useLoaderData()

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
