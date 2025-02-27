"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Monitor, ShoppingCart, Code, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"

interface NavbarProps {
  translations?: {
    products?: string
    services?: string
    about?: string
    contact?: string
    getStarted?: string
  }
  isLoading?: boolean
}

const defaultTranslations = {
  products: "Products",
  services: "Services",
  about: "About",
  contact: "Contact",
  getStarted: "Get Started",
}

const Navbar: React.FC<NavbarProps> = ({ translations = {}, isLoading = false }) => {
  const [isOpen, setIsOpen] = useState(false)

  const t = { ...defaultTranslations, ...translations }

  const menuItems = [
    { href: "/products", label: t.products, icon: ShoppingCart },
    { href: "/services", label: t.services, icon: Code },
    { href: "/about", label: t.about, icon: Monitor },
    { href: "/contact", label: t.contact },
  ]

  if (isLoading) {
    return (
      <nav className="fixed w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b h-16" />
    )
  }

  return (
    <nav className="fixed w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Monitor className="h-8 w-8" />
              <span className="font-bold text-xl">BestOf</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {/* Using the dedicated language switcher component */}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-b">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-base font-medium text-foreground">Language</span>
              <LanguageSwitcher />
            </div>
            <Button className="w-full mt-4">{t.getStarted}</Button>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar