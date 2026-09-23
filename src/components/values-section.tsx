import { HugeiconsIcon } from '@hugeicons/react'
import { Award01Icon, Compass01Icon, EyeIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/components/craft'

type ValuesItem = {
  label: string
  title: string
  body: string
  icon: typeof EyeIcon
  accent: string
  number: string
}

const ITEMS: ValuesItem[] = [
  {
    label: 'Our Vision',
    title: 'To be the premier institution preserving and promoting Idoma culture',
    body: 'Fostering community pride, and inspiring future generations through everything we do.',
    icon: EyeIcon,
    accent: 'from-amber-500/60 to-orange-900/80',
    number: '01',
  },
  {
    label: 'Our Mission',
    title: 'To continuously preserve and promote Idoma culture through recognition',
    body: 'Museum experiences, educational resources, and cultural exchange that keep our heritage alive.',
    icon: Compass01Icon,
    accent: 'from-stone-500/60 to-neutral-900/80',
    number: '02',
  },
  {
    label: 'Our Values',
    title: 'Excellence, cultural preservation, community engagement, and innovation',
    body: 'Guided by inclusive recognition of achievements across all fields and generations.',
    icon: Award01Icon,
    accent: 'from-amber-700/60 to-neutral-950/90',
    number: '03',
  },
]

export default function ValuesSection() {
  return (
    <section className="not-prose bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">
            Our guiding principles
          </span>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Vision, Mission &amp; Values
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-8 lg:gap-0 lg:divide-y lg:divide-border">
          {ITEMS.map((item, index) => {
            const imageFirst = index % 2 === 1
            return (
              <div
                key={item.label}
                className="grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12"
              >
                <div
                  className={cn(
                    'flex flex-col gap-4',
                    imageFirst ? 'lg:order-2' : 'lg:order-1',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-white">
                      <HugeiconsIcon icon={item.icon} className="size-5" strokeWidth={2} />
                    </span>
                    <span className="text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="text-2xl leading-snug font-semibold tracking-tight text-foreground md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>

                <div
                  className={cn(
                    'relative h-64 overflow-hidden rounded-3xl md:h-80 lg:h-96',
                    imageFirst ? 'lg:order-1' : 'lg:order-2',
                  )}
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br', item.accent)} />
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background:
                        'radial-gradient(120% 120% at 50% 0%, rgba(13,9,6,0) 30%, rgba(13,9,6,0.65) 100%)',
                    }}
                  />
                  <span className="absolute top-4 right-5 font-mono text-lg text-white/50">
                    {item.number}
                  </span>
                  <img
                    src="/logo.png"
                    alt=""
                    aria-hidden
                    className="absolute top-1/2 left-1/2 size-36 -translate-x-1/2 -translate-y-1/2 object-contain opacity-30 md:size-44"
                  />
                  <div className="absolute right-6 bottom-6 left-6 flex flex-col gap-1">
                    <span className="text-[11px] font-medium tracking-[0.25em] text-white/70 uppercase">
                      {item.label}
                    </span>
                    <span className="max-w-xs text-pretty text-lg leading-snug font-medium text-white">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}