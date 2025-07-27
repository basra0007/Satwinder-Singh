"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { OrdersTable } from "@/components/orders-table"
import { Plus } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Orders</CardTitle>
          <Button onClick={() => router.push("/dashboard/orders/new")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Order
          </Button>
        </CardHeader>
        <CardContent>
          <OrdersTable />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
