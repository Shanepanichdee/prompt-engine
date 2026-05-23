'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TopBar } from '@/components/TopBar'
import { useState } from 'react'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

  const checkout = async (plan: 'pro' | 'day') => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    if (res.status === 401) {
      router.push('/api/auth/signin?callbackUrl=/pricing')
      return
    }
    const data = (await res.json()) as { url?: string }
    if (data.url) window.location.href = data.url
  }

  const isPro = !!session?.user?.isPro

  return (
    <main className={`page${darkMode ? ' dark' : ''}`}>
      <TopBar darkMode={darkMode} onDarkMode={setDarkMode} />

      <div className="pricing-page">
        <div className="pricing-hero">
          <h1 className="pricing-headline">Simple pricing</h1>
          <p className="pricing-sub">Start free. Upgrade when you need more.</p>
        </div>

        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card">
            <div className="pricing-card-name">Free</div>
            <div className="pricing-card-price">$0<span>/month</span></div>
            <ul className="pricing-features">
              <li>All 14 frameworks</li>
              <li>Build prompts</li>
              <li>Browse Explore</li>
              <li className="pricing-feature-off">Save prompts</li>
              <li className="pricing-feature-off">History</li>
              <li className="pricing-feature-off">Compare frameworks</li>
            </ul>
            <div className="pricing-card-cta">
              <span className="pricing-current-label">Your current plan</span>
            </div>
          </div>

          {/* Pro */}
          <div className="pricing-card pricing-card-featured">
            <div className="pricing-badge">Most popular</div>
            <div className="pricing-card-name">Pro</div>
            <div className="pricing-card-price">$5<span>/month</span></div>
            <ul className="pricing-features">
              <li>Everything in Free</li>
              <li>Unlimited saves</li>
              <li>History page</li>
              <li>Compare frameworks</li>
              <li>Post to Explore</li>
              <li>Cancel anytime</li>
            </ul>
            <div className="pricing-card-cta">
              {isPro ? (
                <span className="pricing-current-label pricing-current-pro">Your current plan</span>
              ) : (
                <button
                  type="button"
                  className="pricing-btn pricing-btn-primary"
                  onClick={() => checkout('pro')}
                >
                  Get Pro
                </button>
              )}
            </div>
          </div>

          {/* Day Pass */}
          <div className="pricing-card">
            <div className="pricing-card-name">Day Pass</div>
            <div className="pricing-card-price">$1.99<span>/day</span></div>
            <ul className="pricing-features">
              <li>Full Pro access</li>
              <li>24-hour access</li>
              <li>One-time payment</li>
              <li>No subscription</li>
              <li>Perfect for a project</li>
            </ul>
            <div className="pricing-card-cta">
              <button
                type="button"
                className="pricing-btn pricing-btn-secondary"
                onClick={() => checkout('day')}
              >
                Buy Day Pass
              </button>
            </div>
          </div>
        </div>

        <p className="pricing-footer-note">
          Payments processed securely by Stripe. Cancel anytime from your Stripe dashboard.
        </p>
      </div>
    </main>
  )
}
