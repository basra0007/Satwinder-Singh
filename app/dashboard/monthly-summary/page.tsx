"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import DashboardLayout from "@/components/dashboard-layout"
import { getStoredOrders } from "@/lib/storage"
import { Loader2 } from "lucide-react"

interface OrderSummary {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByType: {
    delivery: number
    pickup: number
    "dine-in": number
  }
}

export default function MonthlyReportPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"))

  // Generate last 12 months for the dropdown
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    }
  })

  const [monthlySummary, setMonthlySummary] = useState<OrderSummary>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    ordersByType: {
      delivery: 0,
      pickup: 0,
      "dine-in": 0,
    },
  })

  const [revenueTrend, setRevenueTrend] = useState<
    Array<{
      date: string
      revenue: number
    }>
  >([])

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus !== "true") {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchMonthlyData(selectedMonth)
    }
  }, [selectedMonth, isAuthenticated])

  const fetchMonthlyData = async (month: string) => {
    try {
      const orders = await getStoredOrders()

      // Filter orders for the selected month
      const monthStart = startOfMonth(new Date(month))
      const monthEnd = endOfMonth(new Date(month))

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.date)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      // Calculate summary
      const totalOrders = monthOrders.length
      const totalRevenue = monthOrders.reduce((sum, order) => sum + order.total_amount, 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate orders by type
      const ordersByType = monthOrders.reduce(
        (acc, order) => {
          acc[order.type as keyof typeof acc]++
          return acc
        },
        { delivery: 0, pickup: 0, "dine-in": 0 },
      )

      setMonthlySummary({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByType,
      })

      // Generate revenue trend data
      const days = Array.from(
        { length: monthEnd.getDate() },
        (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1),
      )

      const trendData = days.map((date) => {
        const dayOrders = monthOrders.filter((order) => {
          const orderDate = new Date(order.date)
          return orderDate.toDateString() === date.toDateString()
        })

        const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_amount, 0)

        return {
          date: format(date, "MMM dd"),
          revenue: dayRevenue,
        }
      })

      setRevenueTrend(trendData)
    } catch (error) {
      console.error("Error fetching monthly data:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  const orderTypeData = [
    { name: "Delivery", value: monthlySummary.ordersByType.delivery },
    { name: "Pickup", value: monthlySummary.ordersByType.pickup },
    { name: "Dine-in", value: monthlySummary.ordersByType["dine-in"] },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Monthly Summary</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {last12Months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlySummary.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySummary.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySummary.averageOrderValue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(monthlySummary.ordersByType).reduce((a, b) => (b[1] > a[1] ? b : a), ["none", 0])[0]}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend</CardTitle>
              <CardDescription>Revenue trend for the selected month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders by Type</CardTitle>
              <CardDescription>Distribution of order types for the month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
