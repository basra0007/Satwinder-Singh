"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Printer } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

interface Company {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
}

interface Order {
  id: string
  companyId: string
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: "completed" | "processing" | "cancelled"
  type: "delivery" | "pickup" | "dine-in"
}

export default function PrintOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus !== "true") {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }

    // Load companies from localStorage
    const storedCompanies = localStorage.getItem("companies")
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies))
    }

    // Load orders (in a real app, this would be from an API)
    // For now, we'll use an empty array as we removed dummy data
    setOrders([])

    setIsLoading(false)
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  const selectedCompanyDetails = companies.find((company) => company.id === selectedCompany)
  const filteredOrders = orders.filter((order) => order.companyId === selectedCompany)

  const calculateTotals = () => {
    return filteredOrders.reduce(
      (acc, order) => {
        acc.totalAmount += order.total
        acc.totalOrders += 1
        return acc
      },
      { totalAmount: 0, totalOrders: 0 },
    )
  }

  const { totalAmount, totalOrders } = calculateTotals()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section,
          .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-4">
        <div className="flex items-center justify-between no-print">
          <h2 className="text-3xl font-bold tracking-tight">Print Orders</h2>
          <div className="flex items-center gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handlePrint} disabled={!selectedCompany}>
              <Printer className="w-4 h-4 mr-2" />
              Print Orders
            </Button>
          </div>
        </div>

        {selectedCompany && (
          <div className="print-section space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">{selectedCompanyDetails?.name}</p>
                    <p>{selectedCompanyDetails?.address}</p>
                  </div>
                  <div>
                    <p>Contact: {selectedCompanyDetails?.contactPerson}</p>
                    <p>Email: {selectedCompanyDetails?.email}</p>
                    <p>Phone: {selectedCompanyDetails?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{format(new Date(order.date), "MMM dd, yyyy")}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.quantity}x {item.name} (${item.price.toFixed(2)})
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {order.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No orders found for this company.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground text-center pt-4">
              Generated on {format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
