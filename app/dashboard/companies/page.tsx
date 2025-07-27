"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { getStoredCompanies, addCompany, updateCompany, deleteCompany, type Company } from "@/lib/storage"
import { isAuthenticated, getUserRole } from "@/lib/cookies"

export default function CompaniesPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newCompany, setNewCompany] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    price_per_item: 0,
    status: "active" as const,
  })

  useEffect(() => {
    // Check authentication and admin role
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const userRole = getUserRole()
    if (userRole !== "admin") {
      router.push("/dashboard")
      return
    }

    setIsAdmin(true)
    loadCompanies()
  }, [router])

  const loadCompanies = async () => {
    setIsLoading(true)
    try {
      const storedCompanies = await getStoredCompanies()
      setCompanies(storedCompanies)
    } catch (error) {
      console.error("Error loading companies:", error)
      setFormError("Failed to load companies. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNewCompany({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      price_per_item: 0,
      status: "active",
    })
    setFormError("")
  }

  const validateForm = (company: typeof newCompany) => {
    if (!company.name.trim()) {
      setFormError("Company name is required")
      return false
    }
    if (!company.contact_person.trim()) {
      setFormError("Contact person is required")
      return false
    }
    if (!company.email.trim()) {
      setFormError("Email is required")
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(company.email)) {
      setFormError("Please enter a valid email address")
      return false
    }

    // Check for duplicate email (excluding current company when editing)
    const existingCompany = companies.find(
      (c) => c.email.toLowerCase() === company.email.toLowerCase() && (!editingCompany || c.id !== editingCompany.id),
    )
    if (existingCompany) {
      setFormError("A company with this email already exists")
      return false
    }

    if (company.price_per_item < 0) {
      setFormError("Price per item cannot be negative")
      return false
    }

    setFormError("")
    return true
  }

  const handleAddCompany = async () => {
    if (!validateForm(newCompany)) return

    setIsSubmitting(true)
    try {
      const result = await addCompany(newCompany)
      if (result) {
        setCompanies([result, ...companies])
        resetForm()
        setShowAddDialog(false)
        console.log("Company added successfully:", result)
      } else {
        setFormError("Failed to add company. Please try again.")
      }
    } catch (error) {
      console.error("Error adding company:", error)
      setFormError("An error occurred while adding the company. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCompany = async () => {
    if (!editingCompany) return
    if (!validateForm(editingCompany)) return

    setIsSubmitting(true)
    try {
      const result = await updateCompany(editingCompany.id, editingCompany)
      if (result) {
        setCompanies(companies.map((company) => (company.id === editingCompany.id ? result : company)))
        setEditingCompany(null)
        setFormError("")
      } else {
        setFormError("Failed to update company. Please try again.")
      }
    } catch (error) {
      console.error("Error updating company:", error)
      setFormError("An error occurred while updating the company.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) return

    try {
      const success = await deleteCompany(id)
      if (success) {
        setCompanies(companies.filter((company) => company.id !== id))
      } else {
        alert("Failed to delete company. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting company:", error)
      alert("An error occurred while deleting the company.")
    }
  }

  const toggleCompanyStatus = async (company: Company) => {
    const newStatus = company.status === "active" ? "inactive" : "active"
    try {
      const result = await updateCompany(company.id, { status: newStatus })
      if (result) {
        setCompanies(companies.map((c) => (c.id === company.id ? result : c)))
      }
    } catch (error) {
      console.error("Error updating company status:", error)
    }
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading companies...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Manage your client companies and their pricing.</CardDescription>
            </div>
            <Dialog
              open={showAddDialog}
              onOpenChange={(open) => {
                setShowAddDialog(open)
                if (!open) {
                  resetForm()
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>Enter the company details and set their pricing.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                      {formError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={newCompany.contact_person}
                      onChange={(e) => setNewCompany({ ...newCompany, contact_person: e.target.value })}
                      placeholder="Enter contact person name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCompany.email}
                      onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCompany.phone}
                      onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCompany.address}
                      onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                      placeholder="Enter company address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerItem">Price Per Item ($)</Label>
                    <Input
                      id="pricePerItem"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newCompany.price_per_item || ""}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          price_per_item: e.target.value ? Number.parseFloat(e.target.value) : 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddDialog(false)
                      resetForm()
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompany} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Company"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search companies by name, contact person, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Price/Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {searchTerm
                          ? "No companies found matching your search."
                          : "No companies found. Add your first company to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.contact_person}</TableCell>
                        <TableCell>{company.email}</TableCell>
                        <TableCell>{company.phone || "—"}</TableCell>
                        <TableCell>${company.price_per_item.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={company.status === "active" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleCompanyStatus(company)}
                          >
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingCompany(company)
                                  setFormError("")
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Company</DialogTitle>
                                <DialogDescription>Update company details and pricing.</DialogDescription>
                              </DialogHeader>
                              {editingCompany && (
                                <div className="space-y-4 py-4">
                                  {formError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                                      {formError}
                                    </div>
                                  )}
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Company Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingCompany.name}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-contactPerson">Contact Person</Label>
                                    <Input
                                      id="edit-contactPerson"
                                      value={editingCompany.contact_person}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          contact_person: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editingCompany.email}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                      id="edit-phone"
                                      value={editingCompany.phone}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          phone: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-address">Address</Label>
                                    <Input
                                      id="edit-address"
                                      value={editingCompany.address}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          address: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-pricePerItem">Price Per Item ($)</Label>
                                    <Input
                                      id="edit-pricePerItem"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={editingCompany.price_per_item}
                                      onChange={(e) =>
                                        setEditingCompany({
                                          ...editingCompany,
                                          price_per_item: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCompany(null)
                                    setFormError("")
                                  }}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateCompany} disabled={isSubmitting}>
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
