import NextAuth, { type NextAuthResult } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'

const result: NextAuthResult = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  callbacks: {
    ...authConfig.callbacks,
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})

export const { handlers, auth, signIn, signOut } = result
