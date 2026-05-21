// Product knowledge base for "Nexus" — a fictional SaaS project management tool.
// In production: these chunks live in a database (PostgreSQL, MongoDB, etc.)
// and are retrieved by vector similarity search (Pinecone, Supabase pgvector, Chroma).

export const knowledgeBase = [
  {
    id: 'pricing-starter',
    content: 'The Starter plan costs $29/month and supports up to 5 team members. It includes unlimited projects, 10 GB storage, and email support. Best for freelancers and small teams.',
  },
  {
    id: 'pricing-pro',
    content: 'The Pro plan costs $79/month and supports up to 25 team members. Includes everything in Starter plus advanced analytics, 50 GB storage, live chat support, and full API access.',
  },
  {
    id: 'pricing-enterprise',
    content: 'The Enterprise plan has custom pricing for unlimited team members. Includes SSO, custom integrations, dedicated account manager, SLA guarantee, and unlimited storage. Contact sales@nexus.com to get a quote.',
  },
  {
    id: 'billing-annual',
    content: 'Annual billing saves 20% compared to monthly billing. You are charged once per year upfront. Annual plans can be cancelled within 30 days of purchase for a full refund.',
  },
  {
    id: 'refund-policy',
    content: 'We offer a 30-day money-back guarantee on all paid plans. To request a refund, email support@nexus.com with your account email. Refunds are processed in 5–7 business days. After 30 days, refunds are not available but you can cancel anytime to stop future charges.',
  },
  {
    id: 'free-trial',
    content: 'All plans include a 14-day free trial with no credit card required. At the end of the trial, choose a plan or your account is automatically moved to a limited free tier.',
  },
  {
    id: 'integrations',
    content: 'Nexus integrates with Slack, GitHub, Jira, Notion, Google Drive, Zapier, and 50+ other tools. API access is available on Pro and Enterprise plans. Webhooks are supported on all paid plans.',
  },
  {
    id: 'security',
    content: 'Nexus is SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Two-factor authentication is available on all plans. SSO is available on Enterprise. Data residency options: US, EU, APAC.',
  },
  {
    id: 'support-channels',
    content: 'Starter: email support with 24-hour response time. Pro: priority email + live chat with 4-hour response. Enterprise: dedicated account manager, phone support, 1-hour response SLA. All plans include the help center and community forum.',
  },
  {
    id: 'cancellation',
    content: 'Cancel anytime from Account Settings → Billing → Cancel Plan. You keep full access until the end of your billing period. Your data is retained for 90 days after cancellation, then permanently deleted. Export your data before cancelling.',
  },
]
