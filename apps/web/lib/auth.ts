import NextAuth, { type NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Resend from 'next-auth/providers/resend'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'
import { isPro, type ProCheckInput } from '@/lib/subscription'

const result: NextAuthResult = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfig.providers,
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM ?? 'Prompt Engine <noreply@data-shane.com>',
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    session({ session, user }) {
      session.user.id = user.id
      try {
        session.user.isPro = isPro(user as unknown as ProCheckInput)
      } catch (err) {
        console.error('isPro check failed:', err)
        session.user.isPro = false
      }
      return session
    },
  },
})

export const { handlers, auth, signIn, signOut } = result
