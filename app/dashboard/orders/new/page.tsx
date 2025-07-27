"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Plus, Minus, Calendar, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStoredCompanies, addStoredOrder, type Company } from "@/lib/storage"

interface PackConfiguration {
  packCount: number
  itemsPerPack: number
  totalItems: number
  totalPrice: number
}

interface OrderItem {
  name: string
  packConfigurations: PackConfiguration[]
  totalItems: number
  totalPrice: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      name: "",
      packConfigurations: [
        {
          packCount: 1,
          itemsPerPack: 1,
          totalItems: 1,
          totalPrice: 0,
        },
      ],
      totalItems: 1,
      totalPrice: 0,
    },
  ])
  const [formData, setFormData] = useState({
    orderType: "delivery" as "delivery" | "pickup" | "dine-in",
    deliveryAddress: "",
    orderNotes: "",
    totalOrderPrice: 0,
    orderDate: new Date(),
  })

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    setIsLoading(true)
    try {
      const storedCompanies = await getStoredCompanies()
      setCompanies(storedCompanies)
    } catch (error) {
      console.error("Error loading companies:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePackTotal = (pack: PackConfiguration) => {
    if (!selectedCompany) return { totalItems: 0, totalPrice: 0 }
    const totalItems = pack.packCount * pack.itemsPerPack
    return {
      totalItems,
      totalPrice: totalItems * selectedCompany.price_per_item,
    }
  }

  const calculateItemTotal = (item: OrderItem) => {
    const totals = item.packConfigurations.reduce(
      (acc, pack) => {
        const packTotals = calculatePackTotal(pack)
        return {
          totalItems: acc.totalItems + packTotals.totalItems,
          totalPrice: acc.totalPrice + packTotals.totalPrice,
        }
      },
      { totalItems: 0, totalPrice: 0 },
    )
    return totals
  }

  const updatePackConfiguration = (
    itemIndex: number,
    packIndex: number,
    field: keyof PackConfiguration,
    value: number,
  ) => {
    if (value < 1) return // Prevent negative or zero values

    const newOrderItems = [...orderItems]
    const pack = newOrderItems[itemIndex].packConfigurations[packIndex]
    pack[field] = value

    // Update pack totals
    const packTotals = calculatePackTotal(pack)
    pack.totalItems = packTotals.totalItems
    pack.totalPrice = packTotals.totalPrice

    // Update item totals
    const itemTotals = calculateItemTotal(newOrderItems[itemIndex])
    newOrderItems[itemIndex].totalItems = itemTotals.totalItems
    newOrderItems[itemIndex].totalPrice = itemTotals.totalPrice

    setOrderItems(newOrderItems)

    // Update total order price
    const totalOrderPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
    setFormData((prev) => ({ ...prev, totalOrderPrice }))
  }

  const addPackConfiguration = (itemIndex: number) => {
    const newOrderItems = [...orderItems]
    newOrderItems[itemIndex].packConfigurations.push({
      packCount: 1,
      itemsPerPack: 1,
      totalItems: 1,
      totalPrice: selectedCompany ? selectedCompany.price_per_item : 0,
    })

    // Update item totals
    const itemTotals = calculateItemTotal(newOrderItems[itemIndex])
    newOrderItems[itemIndex].totalItems = itemTotals.totalItems
    newOrderItems[itemIndex].totalPrice = itemTotals.totalPrice

    setOrderItems(newOrderItems)

    // Update total order price
    const totalOrderPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
    setFormData((prev) => ({ ...prev, totalOrderPrice }))
  }

  const removePackConfiguration = (itemIndex: number, packIndex: number) => {
    if (orderItems[itemIndex].packConfigurations.length > 1) {
      const newOrderItems = [...orderItems]
      newOrderItems[itemIndex].packConfigurations = newOrderItems[itemIndex].packConfigurations.filter(
        (_, i) => i !== packIndex,
      )

      // Update item totals
      const itemTotals = calculateItemTotal(newOrderItems[itemIndex])
      newOrderItems[itemIndex].totalItems = itemTotals.totalItems
      newOrderItems[itemIndex].totalPrice = itemTotals.totalPrice

      setOrderItems(newOrderItems)

      // Update total order price
      const totalOrderPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
      setFormData((prev) => ({ ...prev, totalOrderPrice }))
    }
  }

  const updateItemName = (index: number, name: string) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index].name = name
    setOrderItems(newOrderItems)
  }

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        name: "",
        packConfigurations: [
          {
            packCount: 1,
            itemsPerPack: 1,
            totalItems: 1,
            totalPrice: selectedCompany ? selectedCompany.price_per_item : 0,
          },
        ],
        totalItems: 1,
        totalPrice: selectedCompany ? selectedCompany.price_per_item : 0,
      },
    ])
  }

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      const newOrderItems = orderItems.filter((_, i) => i !== index)
      setOrderItems(newOrderItems)

      // Update total order price
      const totalOrderPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
      setFormData((prev) => ({ ...prev, totalOrderPrice }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCompany) {
      alert("Please select a company")
      return
    }

    if (orderItems.some((item) => !item.name.trim())) {
      alert("Please provide names for all items")
      return
    }

    if (formData.orderType === "delivery" && !formData.deliveryAddress.trim()) {
      alert("Please provide a delivery address")
      return
    }

    setIsSubmitting(true)
    try {
      const newOrder = {
        company_id: selectedCompany.id,
        company_name: selectedCompany.name,
        date: formData.orderDate.toISOString(),
        items: orderItems,
        total_amount: formData.totalOrderPrice,
        status: "processing" as const,
        type: formData.orderType,
        delivery_address: formData.orderType === "delivery" ? formData.deliveryAddress : undefined,
        notes: formData.orderNotes || undefined,
      }

      const result = await addStoredOrder(newOrder)
      if (result) {
        alert("Order added successfully!")
        router.push("/dashboard/orders")
      } else {
        alert("Failed to add order. Please try again.")
      }
    } catch (error) {
      console.error("Error adding order:", error)
      alert("An error occurred while adding the order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    setSelectedCompany(company || null)

    if (company) {
      // Recalculate all totals with new price
      const newOrderItems = orderItems.map((item) => {
        const updatedItem = {
          ...item,
          packConfigurations: item.packConfigurations.map((pack) => {
            const totalItems = pack.packCount * pack.itemsPerPack
            return {
              ...pack,
              totalItems,
              totalPrice: totalItems * company.price_per_item,
            }
          }),
        }
        const itemTotals = calculateItemTotal(updatedItem)
        updatedItem.totalItems = itemTotals.totalItems
        updatedItem.totalPrice = itemTotals.totalPrice
        return updatedItem
      })

      setOrderItems(newOrderItems)

      // Update total order price
      const totalOrderPrice = newOrderItems.reduce((sum, item) => sum + item.totalPrice, 0)
      setFormData((prev) => ({ ...prev, totalOrderPrice }))
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, orderDate: date }))
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Add New Order</CardTitle>
          <CardDescription>Enter order details below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Select Company</Label>
              <Select value={selectedCompany?.id} onValueChange={handleCompanyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} - ${company.price_per_item.toFixed(2)}/item
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.orderDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.orderDate ? format(formData.orderDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.orderDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date > new Date()} // Disable future dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedCompany ? (
              <div className="bg-muted/50 p-4 rounded-lg mb-6">
                <div className="space-y-1">
                  <p className="font-medium">Selected Company: {selectedCompany.name}</p>
                  <p className="text-sm text-muted-foreground">Contact: {selectedCompany.contact_person}</p>
                  <p className="text-sm text-muted-foreground">Email: {selectedCompany.email}</p>
                  <p className="text-sm text-muted-foreground">Phone: {selectedCompany.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    Price Per Item: ${selectedCompany.price_per_item.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6">
                Please select a company to continue
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Order Items</Label>
                <Button type="button" variant="outline" onClick={addOrderItem}>
                  Add New Item
                </Button>
              </div>

              {orderItems.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {itemIndex + 1}</h4>
                    {orderItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(itemIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove Item
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItemName(itemIndex, e.target.value)}
                        placeholder="Enter item name"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Pack Configurations</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addPackConfiguration(itemIndex)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Pack Configuration
                        </Button>
                      </div>

                      {item.packConfigurations.map((pack, packIndex) => (
                        <div key={packIndex} className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">Pack Configuration {packIndex + 1}</Badge>
                            {item.packConfigurations.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePackConfiguration(itemIndex, packIndex)}
                              >
                                <Minus className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Number of Packs</Label>
                              <Input
                                type="number"
                                min="1"
                                value={pack.packCount}
                                onChange={(e) =>
                                  updatePackConfiguration(itemIndex, packIndex, "packCount", Number(e.target.value))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Items Per Pack</Label>
                              <Input
                                type="number"
                                min="1"
                                value={pack.itemsPerPack}
                                onChange={(e) =>
                                  updatePackConfiguration(itemIndex, packIndex, "itemsPerPack", Number(e.target.value))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Total Items in Pack: {pack.totalItems}</p>
                            <p>Pack Total: ${pack.totalPrice.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right font-medium border-t pt-4">
                    <p>Total Items: {item.totalItems}</p>
                    <p>Item Total: ${item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="text-right text-lg font-bold border-t pt-4">
                Order Total: ${formData.totalOrderPrice.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={formData.orderType} onValueChange={(value) => handleSelectChange("orderType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="dine-in">Dine-in</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.orderType === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required={formData.orderType === "delivery"}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="orderNotes">Additional Notes</Label>
              <Textarea
                id="orderNotes"
                name="orderNotes"
                placeholder="Special instructions, allergies, etc."
                value={formData.orderNotes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Order...
                </>
              ) : (
                "Add Order"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </DashboardLayout>
  )
}
