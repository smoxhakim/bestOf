// bestOf/app/admin/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag, List, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Define types for stats
interface DashboardStats {
  products: number;
  orders: number;
  categories: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        // Fetch orders
        const ordersResponse = await fetch('/api/orders');
        const ordersData = await ordersResponse.json();
        
        // Calculate total revenue from orders
        const totalRevenue = ordersData.reduce((sum: number, order: any) => {
          return sum + (order.product?.price || 0);
        }, 0);
        
        // Set dashboard stats
        setStats({
          products: productsData.length,
          orders: ordersData.length,
          categories: categoriesData.length,
          revenue: totalRevenue
        });
        
        // Set recent orders (most recent 3)
        setRecentOrders(ordersData.slice(0, 3));
        
        // Set popular products (sort by most ordered)
        const productCounts = productsData.map((product: any) => {
          const orderCount = ordersData.filter((order: any) => order.productId === product.id).length;
          return { ...product, orderCount };
        }).sort((a: any, b: any) => b.orderCount - a.orderCount);
        
        setPopularProducts(productCounts.slice(0, 3));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Products",
      value: stats.products,
      description: "Total products in inventory",
      icon: Package,
      href: "/admin/products",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Orders",
      value: stats.orders,
      description: "Total customer orders",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Categories",
      value: stats.categories,
      description: "Product categories",
      icon: List,
      href: "/admin/categories",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      description: "Total revenue this month",
      icon: TrendingUp,
      href: "/admin/orders",
      color: "bg-amber-500/10 text-amber-500"
    }
  ];

  return (
    <div className="p-6 bg-background">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store&apos;s performance and activity.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Card key={card.title} className="overflow-hidden transition-all hover:shadow-md">
            <Link href={card.href} className="block h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <div key={order.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div>
                        <p className="font-medium">Order #{order.id.substring(0, 4)}</p>
                        <p className="text-sm text-muted-foreground">{order.product?.name || 'Unknown Product'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.product?.price?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} 
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No orders found
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">View All Orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Most viewed products this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {popularProducts.length > 0 ? (
                  popularProducts.map((product, index) => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{product.orderCount} orders</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/admin/products">
              <Button variant="outline" size="sm">View All Products</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}