// app/(portal)/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Sidebar } from "@/components/portal/Sidebar"
import { Toaster } from "sonner"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Portal - Auto Detailing",
  description: "Admin dashboard for auto detailing business",
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login")
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex min-h-screen">
          <Sidebar user={session.user} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}