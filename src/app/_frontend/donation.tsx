import Donate from '@/components/donate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend/donation')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="flex items-center justify-center py-8 md:py-12">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8">
        <Donate />
      </div>
    </section>
  )
}
