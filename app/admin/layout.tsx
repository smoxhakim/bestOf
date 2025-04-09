// bestOf/app/admin/layout.tsx
import { ReactNode } from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import ClientProvider from "@/components/providers/client-provider"
import AdminLayoutContent from "@/components/admin-layout-content"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <ClientProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </ClientProvider>
  )
}

