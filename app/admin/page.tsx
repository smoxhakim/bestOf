// bestOf/app/admin/page.tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center  p-6 bg-background min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
      <Link href="/admin/products">
        <Button>Manage Products</Button>
      </Link>
    </div>
  )
}