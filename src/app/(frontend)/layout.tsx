import { Main } from '@/components/craft'
import { Footer } from '@/components/footer'
import MainNavigation from '@/components/frontend-nav'
import { Toaster } from '@/components/ui/toast'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import Script from "next/script"

import Providers from './providers'

import '@/globals.css'

export const metadata: Metadata = {
  title: 'Idoma Hall of Fame',
  description:
    'A sanctuary of cultural pride, a repository of achievements, and a testament to the enduring spirit of the Idoma people.',
  icons: {
    icon: '/logo.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="scroll-smooth antialiased focus:scroll-auto"
		>
			<head>
	      <link rel="preconnect" href="https://fonts.googleapis.com" />
	      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
	      <link
	        rel="stylesheet"
	        href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono:wght@100..700&display=swap"
	      />
			</head>
      <body>
        <Providers>
          <Main className="font-sans w-full">
            <MainNavigation />
            {children}
            <Footer />
            <Toaster />
          </Main>
				</Providers>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
