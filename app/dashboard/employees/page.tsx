"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, CalendarIcon, Loader2 } from "lucide-react"
import { getStoredEmployees, addEmployee, updateEmployee, deleteEmployee, type Employee } from "@/lib/storage"
import { cn } from "@/lib/utils"

export default function EmployeesPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as const,
    status: "active" as const,
    start_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    // In a real app, verify if user is admin
    const authStatus = localStorage.getItem("isAuthenticated")
    const userRole = localStorage.getItem("userRole")

    if (authStatus !== "true") {
      router.push("/login")
    } else if (userRole !== "admin") {
      router.push("/dashboard")
    } else {
      setIsAdmin(true)
    }

    loadEmployees()
  }, [router])

  const loadEmployees = async () => {
    setIsLoading(true)
    try {
      const storedEmployees = await getStoredEmployees()
      setEmployees(storedEmployees)
    } catch (error) {
      console.error("Error loading employees:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!newEmployee.name.trim()) {
      setFormError("Employee name is required")
      return false
    }
    if (!newEmployee.email.trim()) {
      setFormError("Email is required")
      return false
    }
    setFormError("")
    return true
  }

  const handleAddEmployee = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const result = await addEmployee(newEmployee)
      if (result) {
        setEmployees([result, ...employees])
        setNewEmployee({
          name: "",
          email: "",
          phone: "",
          role: "staff",
          status: "active",
          start_date: new Date().toISOString().split("T")[0],
        })
        setShowAddDialog(false)
      } else {
        setFormError("Failed to add employee. Please try again.")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      setFormError("An error occurred while adding the employee.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return

    setIsSubmitting(true)
    try {
      const result = await updateEmployee(editingEmployee.id, editingEmployee)
      if (result) {
        setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? result : emp)))
        setEditingEmployee(null)
      }
    } catch (error) {
      console.error("Error updating employee:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return

    try {
      const success = await deleteEmployee(id)
      if (success) {
        setEmployees(employees.filter((emp) => emp.id !== id))
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
    }
  }

  const toggleEmployeeStatus = async (employee: Employee) => {
    const newStatus = employee.status === "active" ? "inactive" : "active"
    try {
      const result = await updateEmployee(employee.id, { status: newStatus })
      if (result) {
        setEmployees(employees.map((emp) => (emp.id === employee.id ? result : emp)))
      }
    } catch (error) {
      console.error("Error updating employee status:", error)
    }
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Loading employees...</p>
        </div>
      </div>
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
              <CardTitle>Employees</CardTitle>
              <CardDescription>Manage your company employees here.</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>Enter the details of the new employee below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                      {formError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEmployee.start_date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEmployee.start_date ? (
                            format(new Date(newEmployee.start_date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(newEmployee.start_date)}
                          onSelect={(date) =>
                            setNewEmployee({
                              ...newEmployee,
                              start_date: date?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newEmployee.role}
                      onValueChange={(value: "admin" | "manager" | "staff") =>
                        setNewEmployee({ ...newEmployee, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEmployee} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Employee"
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No employees found. Add your first employee to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{format(new Date(employee.start_date), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={employee.status === "active" ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => toggleEmployeeStatus(employee)}
                          >
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setEditingEmployee(employee)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Employee</DialogTitle>
                                <DialogDescription>Update employee details.</DialogDescription>
                              </DialogHeader>
                              {editingEmployee && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Full Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={editingEmployee.name}
                                      onChange={(e) =>
                                        setEditingEmployee({
                                          ...editingEmployee,
                                          name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                      id="edit-email"
                                      type="email"
                                      value={editingEmployee.email}
                                      onChange={(e) =>
                                        setEditingEmployee({
                                          ...editingEmployee,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                      id="edit-phone"
                                      value={editingEmployee.phone}
                                      onChange={(e) =>
                                        setEditingEmployee({
                                          ...editingEmployee,
                                          phone: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !editingEmployee.start_date && "text-muted-foreground",
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {editingEmployee.start_date ? (
                                            format(new Date(editingEmployee.start_date), "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                          mode="single"
                                          selected={new Date(editingEmployee.start_date)}
                                          onSelect={(date) =>
                                            setEditingEmployee({
                                              ...editingEmployee,
                                              start_date:
                                                date?.toISOString().split("T")[0] ||
                                                new Date().toISOString().split("T")[0],
                                            })
                                          }
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                      value={editingEmployee.role}
                                      onValueChange={(value: "admin" | "manager" | "staff") =>
                                        setEditingEmployee({ ...editingEmployee, role: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="staff">Staff</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingEmployee(null)}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateEmployee} disabled={isSubmitting}>
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
                            onClick={() => handleDeleteEmployee(employee.id)}
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
