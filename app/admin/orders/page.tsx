'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, fetchOrders])
  
  const deleteOrder = useCallback(async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete order')
      }

      // Remove the order from the state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId))

      toast({
        title: "Order Deleted",
        description: "The order has been successfully deleted.",
        variant: "success",
      })
    } catch (error: any) {
      console.error('Error deleting order:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete order",
        variant: "destructive",
      })
    }
  }, [toast])

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId)
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order status')
      }

      const updatedOrder = await response.json()
      
      // Update orders list with the updated order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      )

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "success",
      })
    } catch (error: any) {
      console.error('Error updating order status:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdatingOrderId(null)
    }
  }, [toast])

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
                  order.status === 'SHIPPED' ? 'primary' :
                  order.status === 'DELIVERED' ? 'success' :
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
            <CardFooter className="flex justify-between pt-2 pb-4 px-6 border-t">
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => deleteOrder(order.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 mr-1"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                Delete Order
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium mr-2">Update Status:</span>
                <Select
                  disabled={updatingOrderId === order.id}
                  defaultValue={order.status}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {updatingOrderId === order.id && (
                  <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 