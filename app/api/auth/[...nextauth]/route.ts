// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// Mock admin user for demo (replace with real users from database)
const demoAdmin = {
  id: "1",
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$EXAMPLEHASH", // password123
  role: "admin"
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo authentication (replace with database lookup)
        if (
          credentials.email === "admin@example.com" &&
          credentials.password === "password123"
        ) {
          return {
            id: demoAdmin.id,
            name: demoAdmin.name,
            email: demoAdmin.email,
            role: demoAdmin.role
          }
        }

        // For production, you'd query the database:
        /*
        const user = await prisma.staff.findUnique({
          where: { email: credentials.email }
        })
        
        if (user && user.hashedPassword) {
          const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)
          if (isValid) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        }
        */

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }