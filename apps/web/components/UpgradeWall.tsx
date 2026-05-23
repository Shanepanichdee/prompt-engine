'use client'

import { useRouter } from 'next/navigation'

type Props = {
  feature: string
}

export function UpgradeWall({ feature }: Props) {
  const router = useRouter()

  const checkout = async (plan: 'pro' | 'day') => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    if (res.status === 401) {
      router.push('/api/auth/signin')
      return
    }
    const data = (await res.json()) as { url?: string }
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="upgrade-wall">
      <div className="upgrade-wall-inner">
        <div className="upgrade-lock">🔒</div>
        <h2 className="upgrade-title">Pro feature</h2>
        <p className="upgrade-desc">{feature} requires a Pro plan or Day Pass.</p>

        <div className="upgrade-plans">
          <div className="upgrade-plan upgrade-plan-featured">
            <div className="upgrade-plan-name">Pro</div>
            <div className="upgrade-plan-price">$5<span>/month</span></div>
            <ul className="upgrade-plan-features">
              <li>Unlimited saves</li>
              <li>History page</li>
              <li>Compare frameworks</li>
              <li>Post to Explore</li>
            </ul>
            <button
              type="button"
              className="upgrade-btn upgrade-btn-primary"
              onClick={() => checkout('pro')}
            >
              Get Pro
            </button>
          </div>

          <div className="upgrade-plan">
            <div className="upgrade-plan-name">Day Pass</div>
            <div className="upgrade-plan-price">$1.99<span>/day</span></div>
            <ul className="upgrade-plan-features">
              <li>Full Pro access</li>
              <li>24-hour access</li>
              <li>Perfect for one project</li>
            </ul>
            <button
              type="button"
              className="upgrade-btn upgrade-btn-secondary"
              onClick={() => checkout('day')}
            >
              Buy Day Pass
            </button>
          </div>
        </div>

        <p className="upgrade-free-note">
          Free plan: build prompts with all 14 frameworks, browse Explore.
        </p>
      </div>
    </div>
  )
}
