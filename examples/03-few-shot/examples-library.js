// Pre-labeled support ticket examples.
// In production: stored in a database, retrieved by embedding similarity (semantic search).
// Each example teaches the AI what a particular severity+category combination looks like.

export const ticketExamples = [
  // Billing — high
  { ticket: 'I was charged twice this month for my subscription', severity: 'high', category: 'billing' },
  { ticket: 'My account shows an overdue balance but I paid three days ago', severity: 'high', category: 'billing' },
  { ticket: 'A charge appeared on my card that I did not authorize', severity: 'high', category: 'billing' },

  // Billing — medium
  { ticket: 'Can I switch from monthly to annual billing mid-cycle?', severity: 'medium', category: 'billing' },
  { ticket: 'I need an invoice for my last three payments for accounting purposes', severity: 'medium', category: 'billing' },

  // Billing — low
  { ticket: 'How do I update my credit card information?', severity: 'low', category: 'billing' },
  { ticket: 'Do you offer a discount for non-profit organizations?', severity: 'low', category: 'billing' },

  // Technical — high
  { ticket: 'The app crashes immediately when I try to export a report to PDF', severity: 'high', category: 'technical' },
  { ticket: 'Our Slack integration stopped sending notifications after the latest update', severity: 'high', category: 'technical' },
  { ticket: 'The login button does not work on Safari mobile, users cannot access the platform', severity: 'high', category: 'technical' },
  { ticket: 'All data in our main project board disappeared this morning', severity: 'high', category: 'technical' },

  // Technical — medium
  { ticket: 'The dashboard is very slow to load — it takes more than 30 seconds', severity: 'medium', category: 'technical' },
  { ticket: 'I accidentally deleted a project. Is there a way to restore it?', severity: 'medium', category: 'technical' },
  { ticket: 'CSV export is missing some columns compared to what I see on screen', severity: 'medium', category: 'technical' },

  // Technical — low
  { ticket: 'The dark mode toggle is not saving my preference between sessions', severity: 'low', category: 'technical' },
  { ticket: 'Search results are showing items from archived projects', severity: 'low', category: 'technical' },

  // General — medium
  { ticket: 'How do I transfer project ownership to another team member?', severity: 'medium', category: 'general' },
  { ticket: 'What happens to our data if we cancel our subscription?', severity: 'medium', category: 'general' },

  // General — low
  { ticket: 'How do I invite team members to join my workspace?', severity: 'low', category: 'general' },
  { ticket: 'Is there a mobile app available for iOS and Android?', severity: 'low', category: 'general' },
  { ticket: 'Can I use the API to automate task creation from our internal system?', severity: 'low', category: 'general' },
]
