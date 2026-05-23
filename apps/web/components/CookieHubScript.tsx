'use client'
import Script from 'next/script'

export function CookieHubScript() {
  return (
    <Script
      src="https://cdn.cookiehub.eu/c2/4658b1f9.js"
      strategy="afterInteractive"
      onLoad={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).cookiehub.load({})
      }}
    />
  )
}
