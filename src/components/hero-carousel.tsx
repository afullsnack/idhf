import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/craft'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRight01Icon,
  ChevronDownIcon,
  PlayIcon,
} from '@hugeicons/core-free-icons'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import type { HeroSlide } from '@/payload-types'

const AUTOPLAY_MS = 6500

type Slide = {
  id: string | number
  eyebrow?: string | null
  title: string
  description?: string | null
  callToActions?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'link' | null
  }[]
  image?: { url?: string | null; alt?: string | null }
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    eyebrow: 'A Sanctuary of Cultural Pride',
    title: 'Welcome to the Idoma Hall of Fame',
    description:
      'Celebrating the remarkable individuals who have shaped the extraordinary legacy of the Idoma people through culture, leadership, and innovation.',
    callToActions: [
      { label: 'Explore Inductees', href: '/inductees', variant: 'primary' },
      { label: 'Watch Video', href: '#', variant: 'secondary' },
    ],
  },
  {
    id: 'slide-2',
    eyebrow: 'A Repository of Achievements',
    title: 'Preserving Our Rich Heritage',
    description:
      'Discover the stories, traditions, and contributions that define the enduring spirit of Idoma culture and community.',
    callToActions: [
      { label: 'Visit Museum', href: '/museum', variant: 'primary' },
      { label: 'Watch Video', href: '#', variant: 'secondary' },
    ],
  },
  {
    id: 'slide-3',
    eyebrow: 'A Testament to Greatness',
    title: 'Honoring Excellence',
    description:
      'Join us in recognizing outstanding achievements in culture, leadership, innovation, and community development.',
    callToActions: [
      { label: 'Nominate Someone', href: '/nominate', variant: 'primary' },
      { label: 'Watch Video', href: '#', variant: 'secondary' },
    ],
  },
  {
    id: 'slide-4',
    eyebrow: 'Bridging Past and Future',
    title: 'Cultural Continuity',
    description:
      'Experience the vibrant traditions and modern innovations that continue to shape the Idoma identity.',
    callToActions: [
      { label: 'Learn More', href: '/about', variant: 'primary' },
      { label: 'Watch Video', href: '#', variant: 'secondary' },
    ],
  },
]

function toSlide(slide: HeroSlide): Slide {
  const image =
    typeof slide.image === 'object' && slide.image
      ? { url: slide.image.url ?? null, alt: slide.image.alt ?? null }
      : undefined

  return {
    id: slide.id,
    eyebrow: slide.eyebrow,
    title: slide.title,
    description: slide.description,
    callToActions: slide.callToActions ?? undefined,
    image,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

interface IHeroCarouselProps {
  slides?: HeroSlide[]
}

export default function HeroCarousel({ slides: payloadSlides = [] }: IHeroCarouselProps) {
  const slides = payloadSlides.length > 0 ? payloadSlides.map(toSlide) : DEFAULT_SLIDES
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [paused, setPaused] = useState(false)
  const slide = slides[current]

  const onSelect = useCallback((nextApi: CarouselApi) => {
    if (!nextApi) return
    setCurrent(nextApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    api.on('reInit', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  useEffect(() => {
    if (!api || slides.length < 2 || paused) return
    const timer = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [api, slides.length, paused])

  return (
    <section
      className="relative h-[calc(100dvh-4.1rem)] min-h-[620px] w-full overflow-hidden bg-neutral-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      <Carousel
        setApi={setApi}
        orientation="vertical"
        opts={{ align: 'start', loop: slides.length > 1 }}
        className="absolute inset-0"
      >
        <CarouselContent className="h-full -mt-0">
          {slides.map((item, index) => (
            <CarouselItem key={item.id} className="h-full basis-full pt-0">
              <SlideBackground slide={item} active={index === current} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="pointer-events-none mx-auto w-full max-w-7xl px-4 pt-20 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={copyContainerVariants}
              className="pointer-events-auto max-w-3xl"
            >
              <SlideCopy slide={slide} index={current} count={count} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute top-1/2 right-4 z-20 hidden -translate-y-1/2 flex-col items-end gap-5 md:right-8 md:flex">
          {slides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group flex items-center gap-2"
            >
              <span
                className={cn(
                  'text-xs font-medium tracking-widest transition-colors',
                  index === current ? 'text-white' : 'text-white/40 group-hover:text-white/70',
                )}
              >
                {pad(index + 1)}
              </span>
              <span
                className={cn(
                  'h-px bg-white/30 transition-all duration-500 group-hover:bg-white/60',
                  index === current ? 'w-12 bg-white' : 'w-5',
                )}
              />
            </button>
          ))}
        </div>
      )}

      {count > 1 && (
        <div className="absolute right-4 bottom-6 z-20 flex items-center gap-2 md:right-8">
          <Button
            variant="ghost"
            size="icon"
            disabled={!api?.canScrollPrev()}
            onClick={() => api?.scrollPrev()}
            aria-label="Previous slide"
            className="border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowUpIcon} strokeWidth={2.25} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!api?.canScrollNext()}
            onClick={() => api?.scrollNext()}
            aria-label="Next slide"
            className="border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowDownIcon} strokeWidth={2.25} />
          </Button>
        </div>
      )}

      {count > 1 && (
        <div className="absolute bottom-6 left-4 z-20 hidden items-center gap-3 text-white/70 md:left-8 md:flex">
          <span className="text-[11px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <HugeiconsIcon icon={ChevronDownIcon} className="size-4" strokeWidth={2.5} />
          </motion.span>
        </div>
      )}
    </section>
  )
}

function SlideBackground({ slide, active }: { slide: Slide; active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {slide.image?.url ? (
        <motion.div
          animate={{ scale: active ? 1.07 : 1 }}
          transition={{ duration: 7, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image.url}
            alt={slide.image.alt ?? ''}
            className="h-full w-full object-cover"
          />
        </motion.div>
      ) : (
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #0d0906 0%, #241610 40%, #4a2d13 75%, #7a4a1e 100%)',
            }}
          />
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            className="absolute top-1/2 left-1/2 size-[42vmin] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08] saturate-0"
          />
        </div>
      )}
    </div>
  )
}

const copyContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  exit: { opacity: 0, y: -18, filter: 'blur(4px)', transition: { duration: 0.25 } },
}

const copyLineVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
  exit: { opacity: 0 },
}

function SlideCopy({ slide, index, count }: { slide: Slide; index: number; count: number }) {
  const primary = slide.callToActions?.find((cta) => cta.variant === 'primary')
  const secondary =
    slide.callToActions?.find((cta) => cta.variant !== 'primary') ??
    slide.callToActions?.[1]

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.div variants={copyLineVariants} className="flex items-center gap-3">
        {slide.eyebrow ? (
          <>
            <span className="h-px w-10 bg-white/60" />
            <span className="text-xs font-semibold tracking-[0.3em] text-white/90 uppercase md:text-sm">
              {slide.eyebrow}
            </span>
          </>
        ) : null}
        {count > 0 && (
          <span className="ml-auto font-mono text-sm text-white/50 lg:hidden">
            {pad(index + 1)}
            <span className="mx-1">/</span>
            {pad(count)}
          </span>
        )}
      </motion.div>

      <motion.h1
        variants={copyLineVariants}
        className="text-balance text-red-400 break-words text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl xl:text-7xl"
      >
        {slide.title}
      </motion.h1>

      {slide.description ? (
        <motion.p
          variants={copyLineVariants}
          className="max-w-xl text-pretty text-base leading-relaxed text-white/80 md:text-lg xl:text-xl"
        >
          {slide.description}
        </motion.p>
      ) : null}

      {(primary || secondary) && (
        <motion.div variants={copyLineVariants} className="flex flex-wrap items-center gap-3.5">
          {primary ? (
            <Button
              size="lg"
              render={<a href={primary.href} className='no-underline!' />}
              className="rounded-full bg-white text-neutral-950 shadow-lg shadow-black/20 hover:bg-white/90 hover:text-neutral-950"
            >
              {primary.label}
              <span data-icon="inline-end">
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
              </span>
            </Button>
          ) : null}
          {secondary ? (
            <Button
              size="lg"
              variant="ghost"
              render={<a href={secondary.href} />}
              className="rounded-full border border-white/30 bg-white/10 text-white! backdrop-blur-md hover:bg-white/20 hover:text-white!"
            >
              <span data-icon="inline-start">
                <HugeiconsIcon icon={PlayIcon} strokeWidth={2.25} />
              </span>
              {secondary.label}
            </Button>
          ) : null}
        </motion.div>
      )}
    </div>
  )
}
