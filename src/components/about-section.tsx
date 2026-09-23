import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, ChevronDownIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/craft'
import type { Artifact, Inductee, Media } from '@/payload-types'

const SLIDES = 4

function mediaUrl(media: (number | Media | null) | undefined): string | null {
  return typeof media === 'object' && media ? media.url ?? null : null
}

interface IAboutSectionProps {
  inductees?: Inductee[]
  artifacts?: Artifact[]
}

export default function AboutSection({ inductees = [], artifacts = [] }: IAboutSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 })
  const x = useTransform(smooth, [0, 1], ['0vw', `${-(SLIDES - 1) * 100}vw`])
  const statsFade = useTransform(smooth, [0.72, 0.82], [0, 1])
  const statsY = useTransform(smooth, [0.72, 0.82], [56, 0])
  const pathProgress = useTransform(smooth, [0.8, 0.96], [0, 1])
  const hintFade = useTransform(smooth, [0.94, 1], [0, 1])

  return (
    <section ref={ref} className="not-prose relative h-[400vh] bg-background">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          <AboutCopySlide />
          <InducteesSlide inductees={inductees} />
          <ArtifactsSlide artifacts={artifacts} />
          <StatsSlide
            pathProgress={pathProgress}
            statsFade={statsFade}
            statsY={statsY}
            hintFade={hintFade}
          />
        </motion.div>

        <div className="absolute right-0 bottom-0 left-0 h-1 bg-muted">
          <motion.div style={{ scaleX: smooth }} className="h-full origin-left bg-primary" />
        </div>
      </div>
    </section>
  )
}

function SlideLabel({ index, title }: { index: string; title: string }) {
  return (
    <div className="absolute top-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 text-[11px] font-semibold tracking-[0.35em] text-muted-foreground uppercase">
      <span className="text-foreground">{index}</span>
      <span className="h-px w-8 bg-border" />
      <span>{title}</span>
    </div>
  )
}

/* ---------------------------------- Slide 1 ---------------------------------- */

function AboutCopySlide() {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden">
      <SlideLabel index="01" title="About Us" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">
            A Sanctuary of Cultural Pride
          </span>
          <h2 className="text-4xl leading-[1.05] font-semibold tracking-tight text-foreground md:text-5xl">
            The Idoma Hall of Fame
          </h2>
          <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
            More than a repository of names, it is a living testament to the resilience, creativity,
            and brilliance that define the spirit of Idoma. Through our comprehensive museum
            experience, educational programs, and annual celebrations, we preserve and promote the
            rich heritage of our people.
          </p>
          <blockquote className="relative max-w-xl border-l-2 border-amber-600 pl-5 text-pretty leading-relaxed text-foreground/80 italic">
            Recognizing and honoring outstanding individuals who have left an indelible mark on the
            cultural, social, and intellectual landscape of the Idoma people.
            <footer className="mt-3 text-sm text-muted-foreground not-italic">
              Founded by <strong className="font-semibold text-foreground">Engr. Agaba Ikwue (FNSE)</strong>
            </footer>
          </blockquote>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<a href="#" />}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
            >
              Learn Our Story
              <span data-icon="inline-end">
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
              </span>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              render={<a href="#" />}
              className="rounded-full border border-border bg-input/40 text-foreground hover:bg-input/70"
            >
              Visit Museum
            </Button>
          </div>
        </div>

        <div className="relative hidden items-center justify-center overflow-hidden rounded-3xl bg-neutral-950 p-10 lg:flex lg:min-h-[460px]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(120% 120% at 50% 0%, rgba(124,74,30,0.55) 0%, rgba(13,9,6,0.9) 60%)',
            }}
          />
          <img
            src="/logo.png"
            alt="Idoma Hall of Fame logo"
            className="relative size-40 object-contain opacity-90"
          />
          <p className="absolute right-6 bottom-6 left-6 text-balance text-center text-sm text-white/60">
            A sanctuary of cultural pride, a repository of achievements, and a testament to the
            enduring spirit of the Idoma people.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Slide 2 ---------------------------------- */

const INDUCTEE_LAYOUT = [
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]
const INDUCTEE_BADGE_INDEX = 4

function InducteesSlide({ inductees }: { inductees: Inductee[] }) {
  const photos = inductees.map((inductee) => ({
    src: mediaUrl(inductee.photo),
    name: inductee.name,
  }))

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden">
      <SlideLabel index="02" title="Inductees" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-5">
          <div className="flex items-end gap-3">
            <span className="text-7xl leading-none font-bold tracking-tight text-foreground md:text-8xl">
              50+
            </span>
            <span className="pb-2 text-lg font-medium text-muted-foreground">Inductees</span>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
            Honored for their exceptional contributions to Idoma culture, leadership, innovation,
            and community development.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<a href="/inductees" />}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
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
              className="rounded-full border border-border bg-input/40 text-foreground hover:bg-input/70"
            >
              Nominate Someone
            </Button>
          </div>
        </div>

        <div className="grid h-[480px] grid-cols-3 grid-rows-3 gap-4">
          {INDUCTEE_LAYOUT.map((span, i) => {
            const photo = photos.length > 0 ? photos[i % photos.length] : undefined
            if (i === INDUCTEE_BADGE_INDEX) {
              return <StatBadge key="badge" className={span} value="50+" label="Legends honored" />
            }
            return <CollageTile key={i} className={span} src={photo?.src} name={photo?.name} />
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Slide 3 ---------------------------------- */

const ARTIFACT_LAYOUT = [
  'col-span-2 row-span-3',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
]
const ARTIFACT_BADGE_INDEX = 2

function ArtifactsSlide({ artifacts }: { artifacts: Artifact[] }) {
  const images = artifacts.map((artifact) => ({
    src: mediaUrl(artifact.image),
    name: artifact.name,
  }))

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden">
      <SlideLabel index="03" title="Artifacts" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid h-[560px] grid-cols-3 grid-rows-4 gap-4">
          {ARTIFACT_LAYOUT.map((span, i) => {
            const image = images.length > 0 ? images[i % images.length] : undefined
            if (i === ARTIFACT_BADGE_INDEX) {
              return <StatBadge key="badge" className={span} value="100+" label="Cultural artifacts" />
            }
            return <CollageTile key={i} className={span} src={image?.src} name={image?.name} />
          })}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-end gap-3">
            <span className="text-7xl leading-none font-bold tracking-tight text-foreground md:text-8xl">
              100+
            </span>
            <span className="pb-2 text-lg font-medium text-muted-foreground">Artifacts</span>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
            Preserved in our digital archive — historical documents, cultural objects, and
            multimedia content that safeguard our heritage for generations to come.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<a href="#" />}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/85"
            >
              Explore the Digital Archive
              <span data-icon="inline-end">
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Shared collage pieces */

function CollageTile({
  className,
  src,
  name,
}: {
  className: string
  src?: string | null
  name?: string | null
}) {
  return (
    <div
      className={cn(
        'group relative min-h-0 overflow-hidden rounded-2xl ring-1 ring-border',
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? ''}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 via-neutral-100 to-neutral-200">
          <img src="/logo.png" alt="" aria-hidden className="size-14 object-contain opacity-40" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {name && (
        <span className="absolute right-2 bottom-2 left-2 truncate text-xs font-medium text-white drop-shadow-sm">
          {name}
        </span>
      )}
    </div>
  )
}

function StatBadge({ className, value, label }: { className: string; value: string; label: string }) {
  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-neutral-950 p-4 text-center',
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(120% 120% at 50% 0%, rgba(124,74,30,0.6) 0%, rgba(13,9,6,1) 65%)',
        }}
      />
      <span className="relative text-4xl font-bold tracking-tight text-white md:text-5xl">{value}</span>
      <span className="relative max-w-[10ch] text-[11px] leading-snug font-medium tracking-wide text-white/70 uppercase">
        {label}
      </span>
    </div>
  )
}

/* ---------------------------------- Slide 4 ---------------------------------- */

function StatsSlide({
  pathProgress,
  statsFade,
  statsY,
  hintFade,
}: {
  pathProgress: MotionValue<number>
  statsFade: MotionValue<number>
  statsY: MotionValue<number>
  hintFade: MotionValue<number>
}) {
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center overflow-hidden bg-neutral-950 text-white">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(120% 100% at 50% 100%, rgba(124,74,30,0.5) 0%, rgba(13,9,6,0.95) 55%)',
        }}
      />
      <SlideLabel index="04" title="Impact" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-14 px-4 sm:px-8">
        <motion.div
          style={{ opacity: statsFade, y: statsY }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <span className="text-xs font-semibold tracking-[0.35em] text-amber-300/90 uppercase">
            A legacy in motion
          </span>
          <h2 className="text-balance text-4xl leading-[1.05] font-semibold tracking-tight md:text-5xl">
            One people. Endless milestones.
          </h2>
        </motion.div>

        <div className="relative grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-6">
          <svg
            viewBox="0 0 1100 240"
            className="pointer-events-none absolute top-1/2 left-1/2 hidden h-48 -translate-x-1/2 -translate-y-1/2 lg:block"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="impact-flow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f0b429" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path
              d="M60,120 C180,30 320,210 460,120 C600,30 740,210 880,120 C950,95 1010,100 1040,120"
              stroke="#fcd34d"
              strokeOpacity="0.18"
              strokeWidth="2"
              strokeDasharray="2 10"
            />
            <motion.path
              d="M60,120 C180,30 320,210 460,120 C600,30 740,210 880,120 C950,95 1010,100 1040,120"
              stroke="url(#impact-flow)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: pathProgress }}
            />
            <motion.g style={{ opacity: pathProgress }}>
              <circle cx="60" cy="120" r="5" fill="#fcd34d" />
              <motion.circle
                cx="1040"
                cy="120"
                r="7"
                fill="#fbbf24"
                animate={{ scale: [1, 1.7], opacity: [0.9, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.g>
          </svg>

          <motion.div style={{ opacity: statsFade, y: statsY }} className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <span className="text-8xl leading-none font-bold tracking-tight md:text-9xl">5+</span>
            <h3 className="text-xl font-semibold tracking-wide uppercase">Annual Events</h3>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-white/60">
              Celebrating Idoma culture and achievements all year round.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: statsFade, y: statsY }}
            className="flex flex-col items-center gap-3 text-center lg:items-end lg:text-right"
          >
            <span className="text-8xl leading-none font-bold tracking-tight md:text-9xl">1M+</span>
            <h3 className="text-xl font-semibold tracking-wide uppercase">Community Members</h3>
            <p className="max-w-xs text-pretty text-sm leading-relaxed text-white/60">
              Connected through our shared cultural heritage.
            </p>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: hintFade }}
          className="flex items-center gap-2 text-xs tracking-[0.35em] text-white/50 uppercase"
        >
          Keep scrolling
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <HugeiconsIcon icon={ChevronDownIcon} className="size-4" strokeWidth={2.5} />
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}