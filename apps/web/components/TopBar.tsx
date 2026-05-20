'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

type Props = {
  darkMode: boolean
  onDarkMode: (v: boolean) => void
}

export function TopBar({ darkMode, onDarkMode }: Props) {
  const { data: session } = useSession()

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img src="/logo-original.png" alt="datashane.com" className="brand-logo" />
        <span className="topbar-product-name">Prompt Engine</span>
        <span className="topbar-by">by datashane.com</span>
      </div>

      <nav className="topbar-nav">
        <Link href="/compare" className="nav-link">Compare</Link>
        <Link href="/explore" className="nav-link">Explore</Link>
        <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer" className="nav-link nav-link-external">QR Engine ↗</a>
      </nav>

      <div className="topbar-user">
        <button
          type="button"
          className="dark-mode-btn"
          onClick={() => onDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
        {session ? (
          <div className="auth-row">
            {session.user?.image && (
              <img src={session.user.image} alt={session.user.name ?? ''} className="avatar" />
            )}
            <Link href="/history" className="auth-link">History</Link>
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
