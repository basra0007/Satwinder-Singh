"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { OrdersTable } from "@/components/orders-table"
import { isAuthenticated } from "@/lib/cookies"
import { calculateDashboardStats, type DashboardStats } from "@/lib/dashboard-utils"
import { Building2, Calendar, DollarSign, ShoppingBag, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    activeCustomers: 0,
  })

  useEffect(() => {
    // Check authentication using cookies instead of localStorage
    if (!isAuthenticated()) {
      router.push("/login")
    } else {
      setLoading(false)
      // Initial load of stats
      updateStats()
    }
  }, [router])

  const updateStats = async () => {
    setStatsLoading(true)
    try {
      const newStats = await calculateDashboardStats()
      setStats(newStats)
    } catch (error) {
      console.error("Error updating stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Refresh stats when component mounts or when orders might have changed
  useEffect(() => {
    if (!loading) {
      updateStats()
    }
  }, [loading])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 w-full">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.todayOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Orders placed today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  `$${stats.totalRevenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                )}
              </div>
              <p className="text-xs text-muted-foreground">Total revenue from all orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Companies with recent orders</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => router.push("/dashboard/orders/new")}>Add New Order</Button>
            <Button variant="outline" onClick={updateStats} disabled={statsLoading}>
              {statsLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Refresh Stats"
              )}
            </Button>
          </div>
          <OrdersTable onOrderChange={updateStats} />
        </div>
      </div>
    </DashboardLayout>
  )
}
