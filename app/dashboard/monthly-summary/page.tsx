"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { getStoredOrders } from "@/lib/storage"
import { isAuthenticated } from "@/lib/cookies"
import { Loader2, TrendingUp, Package, DollarSign, Calendar } from "lucide-react"

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

interface DayData {
  date: string
  revenue: number
  orders: number
}

export default function MonthlyReportPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)
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

  const [dailyData, setDailyData] = useState<DayData[]>([])

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    setIsLoading(false)
    fetchMonthlyData(selectedMonth)
  }, [router])

  useEffect(() => {
    if (!isLoading) {
      fetchMonthlyData(selectedMonth)
    }
  }, [selectedMonth, isLoading])

  const fetchMonthlyData = async (month: string) => {
    setDataLoading(true)
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

      // Generate daily data
      const days = Array.from(
        { length: monthEnd.getDate() },
        (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1),
      )

      const dailyStats = days.map((date) => {
        const dayOrders = monthOrders.filter((order) => {
          const orderDate = new Date(order.date)
          return orderDate.toDateString() === date.toDateString()
        })

        const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total_amount, 0)

        return {
          date: format(date, "MMM dd"),
          revenue: dayRevenue,
          orders: dayOrders.length,
        }
      })

      setDailyData(dailyStats)
    } catch (error) {
      console.error("Error fetching monthly data:", error)
    } finally {
      setDataLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getMostPopularType = () => {
    const entries = Object.entries(monthlySummary.ordersByType)
    if (entries.length === 0) return "None"
    const max = entries.reduce((a, b) => (b[1] > a[1] ? b : a))
    return max[1] > 0 ? max[0].charAt(0).toUpperCase() + max[0].slice(1) : "None"
  }

  const getHighestRevenueDay = () => {
    if (dailyData.length === 0) return "No data"
    const maxDay = dailyData.reduce((a, b) => (b.revenue > a.revenue ? b : a))
    return maxDay.revenue > 0 ? maxDay.date : "No sales"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Loading monthly data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{monthlySummary.totalOrders.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Orders this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {monthlySummary.totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Revenue this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    $
                    {monthlySummary.averageOrderValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Per order average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Popular Type</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getMostPopularType()}</div>
                  <p className="text-xs text-muted-foreground">Most ordered type</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Types Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of order types for {format(new Date(selectedMonth), "MMMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(monthlySummary.ordersByType).map(([type, count]) => {
                      const percentage = monthlySummary.totalOrders > 0 ? (count / monthlySummary.totalOrders) * 100 : 0
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="capitalize font-medium">{type.replace("-", " ")}</span>
                            <span className="text-muted-foreground">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Performance</CardTitle>
                  <CardDescription>Key metrics for the selected month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Highest Revenue Day</div>
                      <div className="text-2xl font-bold">{getHighestRevenueDay()}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Total Days with Orders</div>
                      <div className="text-2xl font-bold">
                        {dailyData.filter((day) => day.orders > 0).length} / {dailyData.length}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Best Single Day Revenue</div>
                      <div className="text-2xl font-bold">
                        $
                        {Math.max(...dailyData.map((d) => d.revenue), 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Average Daily Orders</div>
                      <div className="text-2xl font-bold">
                        {dailyData.length > 0 ? (monthlySummary.totalOrders / dailyData.length).toFixed(1) : "0"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {monthlySummary.totalOrders === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground">
                      No orders were placed in {format(new Date(selectedMonth), "MMMM yyyy")}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
