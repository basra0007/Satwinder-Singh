import { getStoredOrders, getStoredCompanies } from "./storage"
import { isToday } from "date-fns"

export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  activeCustomers: number
}

export async function calculateDashboardStats(): Promise<DashboardStats> {
  try {
    const [orders, companies] = await Promise.all([getStoredOrders(), getStoredCompanies()])

    // Calculate total orders
    const totalOrders = orders.length

    // Calculate today's orders
    const todayOrders = orders.filter((order) => isToday(new Date(order.date))).length

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)

    // Calculate active customers (companies with orders in the last 30 days)
    const activeCompanyIds = new Set(
      orders
        .filter((order) => {
          const orderDate = new Date(order.date)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return orderDate >= thirtyDaysAgo
        })
        .map((order) => order.company_id),
    )

    const activeCustomers = activeCompanyIds.size

    return {
      totalOrders,
      todayOrders,
      totalRevenue,
      activeCustomers,
    }
  } catch (error) {
    console.error("Error calculating dashboard stats:", error)
    return {
      totalOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
      activeCustomers: 0,
    }
  }
}
