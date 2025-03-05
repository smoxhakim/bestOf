'use client'

import type React from "react"
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('@/components/navbar'), { ssr: false })
const Footer = dynamic(() => import('@/components/footer'), { ssr: false })
const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), { ssr: false })
const Providers = dynamic(() => import('@/components/providers').then(mod => mod.Providers), { ssr: false })

export default function LayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Navbar isLoading={false} />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Toaster />
    </Providers>
  )
} 