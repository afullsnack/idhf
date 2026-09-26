import NotFoundContent from '@/components/not-found-page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found — Idoma Hall of Fame',
}

export default function NotFound() {
  return <NotFoundContent />
}
