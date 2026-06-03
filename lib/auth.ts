import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const email = credentials.email.toLowerCase().trim()

        // Check rate limiting
        const now = Date.now()
        const attempts = loginAttempts.get(email)
        
        if (attempts) {
          if (now - attempts.lastAttempt < LOCKOUT_DURATION && attempts.count >= MAX_LOGIN_ATTEMPTS) {
            throw new Error(`Too many login attempts. Please try again in ${Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 60000)} minutes.`)
          }
          
          if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
            loginAttempts.delete(email)
          }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (!user) {
            recordFailedAttempt(email)
            throw new Error("Invalid email or password")
          }

          if (!user.password) {
            recordFailedAttempt(email)
            throw new Error("Invalid email or password")
          }

          // Verify password with timing attack protection
          const isValid = await bcrypt.compare(credentials.password, user.password)

          if (!isValid) {
            recordFailedAttempt(email)
            throw new Error("Invalid email or password")
          }

          // Clear failed attempts on successful login
          loginAttempts.delete(email)

          // Update last login time
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              // Add lastLogin field if you want to track this
            }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error
          }
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Refresh user data from database
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      
      return token
    }
  },
  events: {
    async signIn({ user }) {
      // Log successful login (you can add logging here)
      console.log(`User ${user.email} signed in successfully`)
    },
    async signOut({ session }) {
      // Log sign out
      if (session?.user?.email) {
        console.log(`User ${session.user.email} signed out`)
      }
    }
  }
}

// Helper function to record failed login attempts
function recordFailedAttempt(email: string) {
  const now = Date.now()
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 }
  
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    attempts.count = 1
  } else {
    attempts.count += 1
  }
  
  attempts.lastAttempt = now
  loginAttempts.set(email, attempts)
} 