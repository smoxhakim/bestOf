'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Order = {
  id: string
  name: string
  companyName: string | null
  city: string
  phone: string
  email: string
  status: string
  createdAt: string
  product: {
    name: string
    price: number
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCsv = async () => {
    try {
      const response = await fetch('/api/orders?format=csv')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'orders.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
  }

  if (status === 'loading' || loading) {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={downloadCsv}>
          Download CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Order #{order.id.slice(-8)}</span>
                <Badge variant={
                  order.status === 'PENDING' ? 'secondary' :
                  order.status === 'CONFIRMED' ? 'default' :
                  order.status === 'CANCELLED' ? 'destructive' :
                  'outline'
                }>
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {order.name}</p>
                    {order.companyName && (
                      <p><span className="font-medium">Company:</span> {order.companyName}</p>
                    )}
                    <p><span className="font-medium">City:</span> {order.city}</p>
                    <p><span className="font-medium">Phone:</span> {order.phone}</p>
                    <p><span className="font-medium">Email:</span> {order.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Product:</span> {order.product.name}</p>
                    <p><span className="font-medium">Price:</span> ${order.product.price}</p>
                    <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 