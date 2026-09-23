import { Main } from '@/components/craft'
import MainNavigation from '@/components/frontend-nav'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import "@/globals.css"
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toast'

export const Route = createFileRoute('/_frontend')({
  component: FrontendLayout,
})

function FrontendLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Main className="font-sans w-full">
        <MainNavigation />
        <Outlet />
        <Footer />
        <Toaster />
      </Main>
    </QueryClientProvider>
  )
}
