"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/dashboard-layout"
import { getUserRole } from "@/lib/cookies"

interface CompanyDetails {
  name: string
  address: string
  phone: string
  email: string
  taxNumber: string
  website: string
}

interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"admin" | "manager" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: "Traditional Kitchen LTD",
    address: "123 Culinary Street",
    phone: "+1 234 567 8900",
    email: "info@traditionalkitchen.com",
    taxNumber: "TAX123456789",
    website: "www.traditionalkitchen.com",
  })

  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const role = getUserRole()
    if (!role) {
      router.push("/login")
    } else {
      setUserRole(role)
    }
    setIsLoading(false)
  }, [router])

  const handleCompanyDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordChange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveCompanyDetails = async () => {
    try {
      // In a real app, save to backend
      console.log("Saving company details:", companyDetails)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Company details saved successfully!")
    } catch (error) {
      console.error("Error saving company details:", error)
      alert("Error saving company details")
    }
  }

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert("New passwords do not match!")
      return
    }

    if (passwordChange.newPassword.length < 8) {
      alert("New password must be at least 8 characters long!")
      return
    }

    try {
      // In a real app, verify current password and update with new password in backend
      const correctCurrentPassword = userRole === "admin" ? "admin123" : "manager123"

      if (passwordChange.currentPassword !== correctCurrentPassword) {
        alert("Current password is incorrect!")
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Password updated successfully!")

      // Clear the form
      setPasswordChange({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      alert("Error updating password")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!userRole) {
    return null // Will redirect to login
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue={userRole === "admin" ? "company" : "password"} className="space-y-4">
        <TabsList>
          {userRole === "admin" && <TabsTrigger value="company">Company Details</TabsTrigger>}
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {userRole === "admin" && (
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>
                  Update your company information here. This will be used across the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="name"
                      value={companyDetails.name}
                      onChange={handleCompanyDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={companyDetails.phone} onChange={handleCompanyDetailsChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={companyDetails.email}
                      onChange={handleCompanyDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={companyDetails.website}
                      onChange={handleCompanyDetailsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxNumber">Tax Number</Label>
                    <Input
                      id="taxNumber"
                      name="taxNumber"
                      value={companyDetails.taxNumber}
                      onChange={handleCompanyDetailsChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={companyDetails.address}
                    onChange={handleCompanyDetailsChange}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSaveCompanyDetails}>Save Company Details</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password here. Please make sure it's secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordChange.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordChange.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                  />
                  <p className="text-sm text-muted-foreground">Password must be at least 8 characters long</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordChange.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
