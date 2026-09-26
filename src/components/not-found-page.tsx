import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFoundContent() {
  return (
    <section className="not-prose bg-background flex min-h-[70vh] items-center justify-center py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-8">
        <img src="/logo.png" alt="Idoma Hall of Fame" className="size-20 object-contain" />

        <span className="text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase">
          Error 404
        </span>

        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Page Not Found
        </h1>

        <p className="text-balance max-w-xl text-lg text-muted-foreground">
          This page isn&apos;t available yet — it may still be under construction. Head back to the
          home page to explore what&apos;s live today.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" render={<Link href="/" />}>
            Back to Home
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/donation" />}>
            Support Us
          </Button>
        </div>
      </div>
    </section>
  )
}
