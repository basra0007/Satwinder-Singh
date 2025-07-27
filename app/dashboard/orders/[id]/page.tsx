"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Building2, Calendar, MapPin, MessageSquare, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"
import { getStoredOrders, type Order } from "@/lib/storage"

export default function ViewOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadOrder = () => {
      const orders = getStoredOrders()
      const foundOrder = orders.find((o) => o.id === params.id)
      setOrder(foundOrder || null)
      setIsLoading(false)
    }

    loadOrder()
  }, [params.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!order) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <p>Order not found</p>
          <Button variant="link" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Truck className="h-4 w-4" />
      case "pickup":
        return <Package className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{order.companyName}</p>
                  <p className="text-sm text-muted-foreground">Company</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(new Date(order.date), "PPP")}</p>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                {getOrderTypeIcon(order.type)}
                <div>
                  <p className="font-medium capitalize">{order.type}</p>
                  <p className="text-sm text-muted-foreground">Order Type</p>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.deliveryAddress}</p>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{order.notes}</p>
                    <p className="text-sm text-muted-foreground">Notes</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>{item.name}</span>
                      <span>${item.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.packConfigurations.map((pack, packIndex) => (
                        <div key={packIndex} className="text-sm text-muted-foreground flex justify-between">
                          <span>
                            {pack.packCount} pack{pack.packCount > 1 ? "s" : ""} × {pack.itemsPerPack} items
                          </span>
                          <span>${pack.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm border-t pt-2">
                      <div className="flex justify-between">
                        <span>Total Items:</span>
                        <span>{item.totalItems}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push(`/dashboard/orders/${params.id}/edit`)}>
            Edit Order
          </Button>
          <Button onClick={() => window.print()}>Print Order</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
