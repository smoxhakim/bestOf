"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, List, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const adminRoutes = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: Package,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: List,
  },
  {
    href: "/admin/trusted-companies",
    label: "Trusted Companies",
    icon: List,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 px-8 border-b h-16">
      <Link href="/" className="font-bold text-xl">
        BESTOF<span className="text-primary">TECH</span>
      </Link>
      
      <div className="ml-auto flex items-center space-x-4">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
              pathname === route.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="gap-1"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
