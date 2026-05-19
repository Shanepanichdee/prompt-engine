import NextAuth from 'next-auth'

export default NextAuth({
  providers: [],
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      if (nextUrl.pathname.startsWith('/history') && !isLoggedIn) {
        return false
      }
      return true
    },
  },
}).auth

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
