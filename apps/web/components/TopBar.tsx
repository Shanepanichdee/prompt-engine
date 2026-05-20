'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

type Props = {
  darkMode: boolean
  compactMode: boolean
  devMode: boolean
  onDarkMode: (v: boolean) => void
  onCompactMode: (v: boolean) => void
  onDevMode: (v: boolean) => void
}

export function TopBar({
  darkMode,
  compactMode,
  devMode,
  onDarkMode,
  onCompactMode,
  onDevMode,
}: Props) {
  const { data: session } = useSession()

  return (
    <header className="topbar">
      <div>
        <div className="brand-row">
          <img src="/logo-original.png" alt="datashane.com logo" className="brand-logo" />
        </div>
        <p className="brand-undertext">datashane.com</p>
        <p className="kicker">Prompt Engineering Studio</p>
        <h1>Prompt Engine</h1>
        <p className="subtitle">
          Build structured prompts with framework guidance, multilingual connectors, and copy-ready output.
        </p>
        <p className="credit">
          Created by{' '}
          <a href="https://datashane.com" target="_blank" rel="noreferrer">
            datashane.com
          </a>
          {' · for QR Code Engine: '}
          <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer">
            qr-engine.data-shane.com
          </a>
        </p>
      </div>
      <div className="mode-controls">
        <label className="dev-toggle">
          <input type="checkbox" checked={darkMode} onChange={(e) => onDarkMode(e.target.checked)} />
          Dark Mode
        </label>
        <label className="dev-toggle">
          <input type="checkbox" checked={compactMode} onChange={(e) => onCompactMode(e.target.checked)} />
          Compact Mode
        </label>
        <label className="dev-toggle">
          <input type="checkbox" checked={devMode} onChange={(e) => onDevMode(e.target.checked)} />
          Dev Mode
        </label>
        <Link href="/explore" className="auth-link">
          Explore
        </Link>
        {session ? (
          <div className="auth-row">
            {session.user?.image && (
              <img src={session.user.image} alt={session.user.name ?? ''} className="avatar" />
            )}
            <Link href="/history" className="auth-link">
              History
            </Link>
            <button type="button" className="auth-btn" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <button type="button" className="auth-btn" onClick={() => signIn()}>
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
