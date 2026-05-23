import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
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
        <GoogleAnalytics gaId="G-H4MH5D51GQ" />
        <CookieHubScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
