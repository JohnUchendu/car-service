// app/admin/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Toaster } from "sonner"
import AdminNav from "@/components/admin/AdminNav"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Dashboard - Refinish",
  description: "Admin dashboard for managing bookings",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  // Get the current path
  const pathname = "/admin/login" // This should come from request context
  
  // Only redirect if NOT on login page and no session
  if (!session && !pathname.includes("/admin/login")) {
    redirect("/admin/login")
  }

  // Don't show AdminNav on login page
  const isLoginPage = pathname.includes("/admin/login")
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen ">
          {!isLoginPage && session && <AdminNav user={session.user} />}
          <main className={isLoginPage ? "" : "pt-16"}>
            <div className={isLoginPage ? "" : "container mx-auto p-4 md:p-6"}>
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}