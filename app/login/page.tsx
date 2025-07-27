"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { setAuth } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (role: "admin" | "manager") => {
    setIsLoading(true)
    setError("")

    try {
      // In a real application, validate against backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (role === "admin" && email === "admin@traditionalkitchen.com" && password === "admin123") {
        setAuth("admin")
        router.push("/dashboard")
        router.refresh() // Force a refresh to update the navigation
      } else if (role === "manager" && email === "manager@traditionalkitchen.com" && password === "manager123") {
        setAuth("manager")
        router.push("/dashboard")
        router.refresh() // Force a refresh to update the navigation
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin" className="text-sm sm:text-base">
              Admin Login
            </TabsTrigger>
            <TabsTrigger value="manager" className="text-sm sm:text-base">
              Manager Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="relative w-[160px] h-[90px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tradition-logo-1-1024x576-Df4QCohI4fY4jXq5NQvOFkJmagAg73.png"
                    alt="Traditional Kitchen Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin("admin")
              }}
            >
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    inputMode="email"
                    placeholder="admin@traditionalkitchen.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="manager">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="relative w-[160px] h-[90px]">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tradition-logo-1-1024x576-Df4QCohI4fY4jXq5NQvOFkJmagAg73.png"
                    alt="Traditional Kitchen Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">Manager Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the manager dashboard
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleLogin("manager")
              }}
            >
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">{error}</div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="manager-email">Email</Label>
                  <Input
                    id="manager-email"
                    type="email"
                    inputMode="email"
                    placeholder="manager@traditionalkitchen.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manager-password">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="manager-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Manager"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
