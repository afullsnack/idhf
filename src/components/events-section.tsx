import type { Event as EventItem, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/craft'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  ArrowRight02Icon,
  Calendar01Icon,
  Clock01Icon,
  Location01Icon,
  Notification01Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

type IconType = typeof Calendar01Icon

function mediaUrl(media: (number | Media | null) | undefined): string | null {
  return typeof media === 'object' && media ? media.url ?? null : null
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})
const timeFmt = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

interface IEventsSectionProps {
  events?: EventItem[]
}

export default function EventsSection({ events = [] }: IEventsSectionProps) {
  const featured = events.find((event) => event.featured) ?? events[0] ?? null
  const featuredId = featured?.id ?? ''
  const rest = events.filter((event) => event.id !== featuredId)

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
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-amber-300/90 uppercase">
            Events &amp; Programs
          </span>
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Upcoming Events</h2>
          <p className="text-pretty leading-relaxed text-white/70">
            Join us for exciting events that celebrate Idoma culture, honor achievements, and bring
            our community together for meaningful experiences.
          </p>
        </div>

        {featured ? (
          <div className="mt-14">
            <FeaturedCard event={featured} />
            {rest.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                {rest.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-14 flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            <p className="max-w-sm">
              No upcoming events yet. Add the first event in the Payload admin to populate this
              section.
            </p>
          </div>
        )}
      </div>

      <DontMissBand />
    </section>
  )
}

function FeaturedCard({ event }: { event: EventItem }) {
  const src = mediaUrl(event.image)
  const when = event.date ? new Date(event.date) : null

  return (
    <article className="grid overflow-hidden rounded-3xl ring-1 ring-white/15 md:grid-cols-2">
      <div className="relative h-72 overflow-hidden md:h-auto">
        {src ? (
          <img
            src={src}
            alt={event.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-[1px]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 to-neutral-950">
            <img
              src="/logo.png"
              alt=""
              aria-hidden
              className="absolute top-1/2 left-1/2 size-48 -translate-x-1/2 -translate-y-1/2 object-contain opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10 md:bg-gradient-to-r" />
        {event.category && (
          <span className="absolute top-5 left-5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 uppercase backdrop-blur-md">
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-5 bg-white/5 p-7 backdrop-blur-md sm:p-9">
        <span className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase">
          Featured Event
          <span className="h-px w-8 bg-amber-300/50" />
        </span>
        <h3 className="text-3xl leading-tight font-semibold tracking-tight">{event.title}</h3>
        {event.description && (
          <p className="text-pretty leading-relaxed text-white/70">{event.description}</p>
        )}
        {when && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MetaItem
              icon={Calendar01Icon}
              text={dateFmt.format(when)}
              label="Date"
            />
            <MetaItem icon={Clock01Icon} text={timeFmt.format(when)} label="Time" />
            {event.venue && <MetaItem icon={Location01Icon} text={event.venue} label="Venue" />}
            {event.expected && <MetaItem icon={UserGroupIcon} text={event.expected} label="Attendance" />}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="lg"
            render={<a href={event.registerUrl || '/events'} />}
            className="rounded-full bg-white text-neutral-950 hover:bg-white/90"
          >
            Register Now
            <span data-icon="inline-end">
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
            </span>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            render={<a href="/events" />}
            className="rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            Learn More
          </Button>
        </div>
      </div>
    </article>
  )
}

function EventCard({ event }: { event: EventItem }) {
  const src = mediaUrl(event.image)
  const when = event.date ? new Date(event.date) : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl ring-1 ring-white/15">
      <div className="relative h-48 overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={event.title}
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
              className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 object-contain opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        {event.category && (
          <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 uppercase backdrop-blur-md">
            {event.category}
          </span>
        )}
        {when && (
          <span className="absolute top-4 right-4 font-mono text-xs text-white/80">
            {dateFmt.format(when)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 bg-white/5 p-6 backdrop-blur-md">
        {when && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} className="size-4 text-amber-300" />
              {dateFmt.format(when)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} className="size-4 text-amber-300" />
              {timeFmt.format(when)}
            </span>
          </div>
        )}
        <h3 className="text-xl leading-snug font-semibold tracking-tight group-hover:text-amber-300 transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-white/60">{event.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {event.venue && (
            <span className="line-clamp-1 text-xs text-white/60">
              <HugeiconsIcon icon={Location01Icon} strokeWidth={2} className="mr-1 inline size-3.5 text-amber-300" />
              {event.venue}
            </span>
          )}
          <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-white/70 transition-colors group-hover:text-amber-300">
            Register for Event
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              strokeWidth={2}
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </article>
  )
}

function MetaItem({ icon, label, text }: { icon: IconType; label: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/15 text-amber-300">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4.5" />
      </span>
      <span className="flex flex-col">
        <span className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">{label}</span>
        <span className="text-sm font-medium text-white/85">{text}</span>
      </span>
    </div>
  )
}

function DontMissBand() {
  return (
    <div className="relative mt-8 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(13,9,6,0) 0%, rgba(37,20,8,0.55) 45%, rgba(90,52,20,0.5) 100%)' }}
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-8 md:py-20">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-7 text-amber-300" />
        </span>
        <h3 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Don&apos;t Miss Our Events
        </h3>
        <p className="max-w-2xl text-pretty leading-relaxed text-white/70">
          Stay updated with all our upcoming events, lectures, and cultural programs. Subscribe to
          our newsletter for the latest announcements.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            render={<a href="/events" />}
            className="rounded-full bg-white text-neutral-950 hover:bg-white/90"
          >
            View All Events
            <span data-icon="inline-end">
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
            </span>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            render={<a href="#" />}
            className="rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
          >
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
    </div>
  )
}