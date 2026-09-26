'use client'

import { cn } from '@/components/craft'
import { useEffect, useMemo, useState } from 'react'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
] as const

type UnitKey = (typeof UNITS)[number]['key']

type Remaining = Record<UnitKey, number> & { expired: boolean }

function getRemaining(target: number): Remaining {
  const diff = Math.max(0, target - Date.now())

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    expired: diff <= 0,
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

/** The logo colour theme: gold `#f0b429` through amber `#d97706`, with a `#fcd34d` highlight. */
const GOLD_TEXT =
  'bg-gradient-to-br from-[#f0b429] via-[#fbbf24] to-[#d97706] bg-clip-text text-transparent'

export interface IEventCountdownProps {
  /** ISO date string (as stored by Payload) or a `Date`. */
  endDate: string | Date
  /** Optional overline shown above the numbers, e.g. "Inauguration Countdown". */
  label?: string | null
  className?: string
}

export default function EventCountdown({ endDate, label, className }: IEventCountdownProps) {
  const target = useMemo(() => {
    const time = endDate instanceof Date ? endDate.getTime() : new Date(endDate).getTime()
    return Number.isNaN(time) ? null : time
  }, [endDate])

  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    target === null ? null : getRemaining(target),
  )

  useEffect(() => {
    if (target === null) return

    setRemaining(getRemaining(target))
    const id = setInterval(() => setRemaining(getRemaining(target)), SECOND)
    return () => clearInterval(id)
  }, [target])

  if (target === null || remaining === null) return null

  if (remaining.expired) {
    return (
      <div className={cn('flex flex-col items-center gap-3', className)} role="timer">
        {label ? <CountdownLabel>{label}</CountdownLabel> : null}
        <span
          className={cn(
            'font-mono text-5xl leading-none font-semibold tracking-tight tabular-nums md:text-7xl',
            GOLD_TEXT,
          )}
        >
          Now Live
        </span>
      </div>
    )
  }

  // The largest remaining unit leads, so days dominate until only hours are
  // left, then hours, then minutes, then seconds.
  const leadIndex = UNITS.findIndex((unit) => remaining[unit.key] > 0)
  const visible = UNITS.slice(leadIndex === -1 ? 0 : leadIndex)
  const leadKey = visible[0]?.key

  return (
    <div className={cn('flex flex-col items-center gap-3', className)} role="timer">
      {label ? <CountdownLabel>{label}</CountdownLabel> : null}

      <div className="flex items-center justify-center gap-3 md:gap-6">
        {visible.map((unit, index) => {
          const isLead = unit.key === leadKey
          const value = remaining[unit.key]

          return (
            <div key={unit.key} className="flex items-center gap-3 md:gap-6">
              {index > 0 ? <Divider /> : null}

              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'font-mono leading-none font-semibold tracking-tight tabular-nums',
                    isLead
                      ? cn('text-6xl md:text-8xl', GOLD_TEXT)
                      : 'text-2xl text-white/65 md:text-4xl',
                  )}
                >
                  {pad(value)}
                </span>
                <span
                  className={cn(
                    'font-medium tracking-[0.3em] uppercase',
                    isLead ? 'text-xs text-white/85 md:text-sm' : 'text-[10px] text-white/45',
                  )}
                >
                  {unit.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <p className="sr-only">
        {visible.map((unit) => `${remaining[unit.key]} ${unit.label.toLowerCase()}`).join(', ')}{' '}
        remaining
      </p>
    </div>
  )
}

function CountdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.35em] text-[#fcd34d] uppercase md:text-xs">
      <span className="h-px w-8 bg-[#f0b429]/60" />
      {children}
    </span>
  )
}

function Divider() {
  return <span aria-hidden className="h-10 w-px bg-white/20 md:h-16" />
}
