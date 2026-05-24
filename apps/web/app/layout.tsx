import type { Metadata } from 'next'
import Script from 'next/script'
import { CookieHubScript } from '@/components/CookieHubScript'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Prompt Engine',
  description: 'Build structured prompts with framework guidance, multilingual connectors, and copy-ready output.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PHEHV8NY6P" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PHEHV8NY6P');
        `}</Script>
        <CookieHubScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
