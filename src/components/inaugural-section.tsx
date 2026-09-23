import { useEffect, useState } from 'react'
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
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
} from '@hugeicons/core-free-icons'
import type { Inductee, Media } from '@/payload-types'

function mediaUrl(media: (number | Media | null) | undefined): string | null {
  return typeof media === 'object' && media ? media.url ?? null : null
}

const pad = (n: number) => String(n).padStart(2, '0')

interface IInauguralSectionProps {
  inductees?: Inductee[]
}

export default function InauguralSection({ inductees = [] }: IInauguralSectionProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    if (!api) return
    const update = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
      setCanPrev(api.canScrollPrev())
      setCanNext(api.canScrollNext())
    }
    update()
    api.on('select', update)
    api.on('reInit', update)
    return () => {
      api.off('select', update)
      api.off('reInit', update)
    }
  }, [api])

  return (
    <section className="not-prose relative overflow-hidden bg-neutral-950 pb-0 text-white">
      <div
        className="absolute inset-x-0 top-0 h-64"
        style={{ background: 'linear-gradient(180deg, rgba(13,9,6,0) 0%, rgba(60,32,10,0.45) 100%)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(80% 55% at 50% 0%, rgba(124,74,30,0.55) 0%, rgba(13,9,6,0) 70%)' }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-8 sm:px-8 md:pt-24">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.3em] text-amber-300/90 uppercase">
              Hall of Fame
            </span>
            <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Inaugural Inductees</h2>
            <p className="text-pretty leading-relaxed text-white/70">
              Meet the exceptional individuals who have been honored for their outstanding
              contributions to Idoma culture, leadership, innovation, and community development.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ArrowButton
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              label="Previous inductee"
              icon={ArrowLeft01Icon}
            />
            <ArrowButton
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              label="Next inductee"
              icon={ArrowRight01Icon}
            />
            {count > 0 && (
              <span className="ml-2 font-mono text-sm text-white/60">
                {pad(current + 1)} / {pad(count)}
              </span>
            )}
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: inductees.length > 2 }}
          className="mt-10"
        >
          <CarouselContent className="-ml-3">
            {inductees.length > 0 ? (
              inductees.map((inductee) => (
                <CarouselItem
                  key={inductee.id}
                  className="basis-[85%] pl-3 sm:basis-[55%] md:basis-[46%] lg:basis-[32%]"
                >
                  <InducteeCard inductee={inductee} />
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="basis-full pl-3">
                <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-10 text-center text-white/60">
                  <p className="max-w-sm">
                    No published inductees yet. Add the first inductee in the Payload admin to
                    populate this carousel.
                  </p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inductees.map((inductee, index) => (
              <button
                key={inductee.id}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to inductee ${index + 1}`}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  index === current ? 'w-8 bg-white' : 'w-3 bg-white/25 hover:bg-white/50',
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <ArrowButton
              onClick={() => api?.scrollPrev()}
              disabled={!canPrev}
              label="Previous inductee"
              icon={ArrowLeft01Icon}
            />
            <ArrowButton
              onClick={() => api?.scrollNext()}
              disabled={!canNext}
              label="Next inductee"
              icon={ArrowRight01Icon}
            />
          </div>
        </div>
      </div>

      <DiscoverBand />
    </section>
  )
}

function ArrowButton({
  onClick,
  disabled,
  label,
  icon,
}: {
  onClick?: () => void
  disabled?: boolean
  label: string
  icon: typeof ArrowRight01Icon
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white disabled:opacity-40"
    >
      <HugeiconsIcon icon={icon} strokeWidth={2.25} />
    </Button>
  )
}

function InducteeCard({ inductee }: { inductee: Inductee }) {
  const src = mediaUrl(inductee.photo)

  return (
    <article className="group relative h-[440px] overflow-hidden rounded-3xl ring-1 ring-white/15">
      {src ? (
        <img
          src={src}
          alt={inductee.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-[2px] transition-all duration-700 group-hover:scale-115 group-hover:opacity-55 group-hover:blur-[1px]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-neutral-950">
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 object-contain opacity-20"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      <div className="relative flex h-full flex-col justify-end gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {inductee.category && (
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 uppercase backdrop-blur-md">
              {inductee.category}
            </span>
          )}
          {inductee.year && (
            <span className="font-mono text-xs text-white/60">{inductee.year}</span>
          )}
        </div>
        <h3 className="text-2xl leading-tight font-semibold">{inductee.name}</h3>
        <span className="flex items-center gap-2 text-sm text-white/60 transition-colors group-hover:text-amber-300">
          Read story
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  )
}

function DiscoverBand() {
  return (
    <div className="relative mt-8 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(13,9,6,0) 0%, rgba(37,20,8,0.55) 45%, rgba(90,52,20,0.5) 100%)' }}
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-8 md:py-20">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-7 text-amber-300" />
        </span>
        <h3 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Discover All Our Inductees
        </h3>
        <p className="max-w-2xl text-pretty leading-relaxed text-white/70">
          Explore the complete collection of remarkable individuals who have shaped the Idoma
          legacy across various fields and generations.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            render={<a href="/inductees" />}
            className="rounded-full bg-white text-neutral-950 hover:bg-white/90"
          >
            View All Inductees
            <span data-icon="inline-end">
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
            </span>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            render={<a href="/nominate" />}
            className="rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            Nominate Someone
          </Button>
        </div>
      </div>
    </div>
  )
}