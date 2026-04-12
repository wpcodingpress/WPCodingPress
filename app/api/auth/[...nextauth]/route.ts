import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'admin',
      name: 'Admin Login',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'admin',
        }
      }
    }),
    CredentialsProvider({
      id: 'client',
      name: 'Client Login',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.isActive) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'client',
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin-login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Get actual role and sessionVersion from database
        let actualRole = 'user'
        let sessionVersion = 1
        if (account?.provider === 'admin') {
          actualRole = 'admin'
        } else if (user.id) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true, sessionVersion: true }
            })
            if (dbUser) {
              actualRole = dbUser.role
              sessionVersion = dbUser.sessionVersion
            }
          } catch (e) { /* ignore */ }
        }
        token.role = actualRole
        token.id = user.id
        token.provider = account?.provider || 'credentials'
        token.sessionVersion = sessionVersion
      }
      // Check session version on existing token
      else if (token.id && token.sessionVersion) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { sessionVersion: true }
          })
          if (dbUser && dbUser.sessionVersion !== token.sessionVersion) {
            // Session version mismatch - token is invalid
            token.role = 'invalidated'
          }
        } catch (e) { /* ignore */ }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Check if session was invalidated
        if (token.role === 'invalidated') {
          throw new Error('Session invalidated')
        }
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
