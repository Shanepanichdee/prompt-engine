import type { Metadata } from 'next'
import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
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
        <GoogleAnalytics gaId="G-H4MH5D51GQ" />
        <Script src="https://cdn.cookiehub.eu/c2/4658b1f9.js" strategy="afterInteractive" />
        <Script id="cookiehub-init" strategy="afterInteractive">{`
          document.addEventListener("DOMContentLoaded", function() {
            window.cookiehub.load({});
          });
        `}</Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
