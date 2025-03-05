'use client'

import { SessionProvider } from "next-auth/react"
import AdminLayoutContent from "@/components/admin-layout-content"

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  )
} 