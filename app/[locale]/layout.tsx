// app/[locale]/layout.tsx
import type React from "react"
import "../globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import  Navbar  from '@/components/navbar'
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BestOf - IT Equipment & Development Services",
  description: "Premium computer equipment and professional development services for businesses",
}

// Define supported locales
const locales = ['en', 'fr'];

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

async function loadMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    // Instead of calling notFound(), return null or default messages
    console.error(`Could not load messages for locale: ${locale}`);
    return {};
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Check if the locale is supported
  if (!locales.includes(locale)) {
    // Don't use notFound() here, it will be handled by middleware
    // or by creating a not-found.tsx page
    return null;
  }
  
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}