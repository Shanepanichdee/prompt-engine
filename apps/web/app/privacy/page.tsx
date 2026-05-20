import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Prompt Engine',
}

export default function PrivacyPage() {
  return (
    <main className="page legal-page">
      <div className="page-nav">
        <Link href="/" className="auth-link">← Back</Link>
      </div>

      <div className="legal-content">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-date">Last updated: May 2026</p>

        <section className="legal-section">
          <h2>1. Who We Are</h2>
          <p>Prompt Engine is a product by <a href="https://datashane.com" target="_blank" rel="noreferrer">datashane.com</a>. We build tools to help you write better AI prompts.</p>
        </section>

        <section className="legal-section">
          <h2>2. What We Collect</h2>
          <p>We collect only what is necessary to provide the service:</p>
          <ul>
            <li><strong>Account information:</strong> Your name and email address when you sign in via Google or email magic link.</li>
            <li><strong>Saved prompts:</strong> Prompt text, framework, language, and optional title when you choose to save a prompt.</li>
            <li><strong>Usage data:</strong> Basic server logs (request timestamps, errors). No analytics tracking or cookies beyond authentication.</li>
          </ul>
          <p>We do not collect browsing history, sell data to third parties, or use your prompts to train AI models.</p>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To authenticate you and maintain your session</li>
            <li>To save and retrieve your prompts</li>
            <li>To generate shareable links for prompts you make public</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Third-Party Services</h2>
          <ul>
            <li><strong>Google OAuth:</strong> Used for sign-in. Governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google's Privacy Policy</a>.</li>
            <li><strong>Resend:</strong> Used to send magic link emails. Your email is passed to Resend solely to deliver the sign-in link.</li>
            <li><strong>Neon (PostgreSQL):</strong> Your account and prompt data is stored on Neon's hosted database infrastructure.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Data Retention</h2>
          <p>Your data is retained as long as your account exists. You can delete individual prompts from your History page. To delete your account and all data, contact us at <a href="mailto:shanepanichdee@gmail.com">shanepanichdee@gmail.com</a>.</p>
        </section>

        <section className="legal-section">
          <h2>6. Security</h2>
          <p>We use industry-standard practices including HTTPS, secure session tokens, and parameterised database queries. No system is 100% secure — use the service accordingly.</p>
        </section>

        <section className="legal-section">
          <h2>7. Contact</h2>
          <p>Questions? Email <a href="mailto:shanepanichdee@gmail.com">shanepanichdee@gmail.com</a>.</p>
        </section>
      </div>

      <footer className="page-footer">
        Created by{' '}
        <a href="https://datashane.com" target="_blank" rel="noreferrer">datashane.com</a>
        {' · '}
        <a href="https://qr-engine.data-shane.com" target="_blank" rel="noreferrer">QR Code Engine</a>
        {' · '}
        <a href="/privacy">Privacy Policy</a>
        {' · '}
        <a href="/terms">Terms of Use</a>
      </footer>
    </main>
  )
}
