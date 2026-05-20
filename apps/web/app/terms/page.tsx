import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Prompt Engine',
}

export default function TermsPage() {
  return (
    <main className="page legal-page">
      <div className="page-nav">
        <Link href="/" className="auth-link">← Back</Link>
      </div>

      <div className="legal-content">
        <h1 className="legal-title">Terms of Use</h1>
        <p className="legal-date">Last updated: May 2026</p>

        <section className="legal-section">
          <h2>1. Acceptance</h2>
          <p>By using Prompt Engine (<a href="https://prompts.data-shane.com">prompts.data-shane.com</a>), you agree to these terms. If you do not agree, do not use the service.</p>
        </section>

        <section className="legal-section">
          <h2>2. What the Service Does</h2>
          <p>Prompt Engine is a tool that helps you write structured AI prompts using established frameworks. It does not include an AI model — it structures your input and you paste the output into an AI of your choice.</p>
        </section>

        <section className="legal-section">
          <h2>3. Your Account</h2>
          <p>You are responsible for keeping your account secure. Do not share your sign-in link. We may suspend accounts that violate these terms.</p>
        </section>

        <section className="legal-section">
          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the service to:</p>
          <ul>
            <li>Generate or share prompts intended to cause harm, harass, or deceive</li>
            <li>Attempt to reverse-engineer, scrape, or overload the service</li>
            <li>Violate any applicable law or third-party rights</li>
          </ul>
          <p>Public prompts are visible to all users. Do not make prompts public if they contain sensitive or private information.</p>
        </section>

        <section className="legal-section">
          <h2>5. Your Content</h2>
          <p>You own the prompts you create. By saving a prompt as public, you grant datashane.com a non-exclusive licence to display it to other users of the service. You can remove public prompts at any time from your History page.</p>
        </section>

        <section className="legal-section">
          <h2>6. Service Availability</h2>
          <p>We aim for high availability but do not guarantee uptime. The service is provided as-is. We may modify or discontinue features at any time.</p>
        </section>

        <section className="legal-section">
          <h2>7. Limitation of Liability</h2>
          <p>datashane.com is not liable for any indirect, incidental, or consequential damages arising from your use of the service. Use at your own discretion.</p>
        </section>

        <section className="legal-section">
          <h2>8. Changes to These Terms</h2>
          <p>We may update these terms. Continued use of the service after changes constitutes acceptance. Material changes will be noted on this page.</p>
        </section>

        <section className="legal-section">
          <h2>9. Contact</h2>
          <p>Questions? Email <a href="mailto:shane@datashane.com">shane@datashane.com</a>.</p>
        </section>
      </div>

      <footer className="page-footer">
        <a href="https://datashane.com" target="_blank" rel="noreferrer">by datashane.com</a>
        {' · '}
        <a href="/privacy">Privacy Policy</a>
        {' · '}
        <a href="/terms">Terms of Use</a>
      </footer>
    </main>
  )
}
