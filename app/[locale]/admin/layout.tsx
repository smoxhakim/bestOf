// bestOf/app/admin/layout.tsx
import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import AdminLayoutContent from "@/components/admin-layout-content"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return <AdminLayoutContent>{children}</AdminLayoutContent>
}

