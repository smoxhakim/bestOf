import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import LayoutClient from './layout-client'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BestOf - Équipement IT & Services de Développement",
  description: "Équipement informatique premium et services de développement professionnels pour les entreprises",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}