"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, ShoppingBag, Users, Settings, Menu, LogOut, Building2, BarChart, Activity } from "lucide-react"
import { clearAuth } from "@/lib/auth"
import { getUserRole } from "@/lib/cookies"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "manager" | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const role = getUserRole()
    setUserRole(role || null)
  }, [])

  // Don't render anything until after hydration
  if (!mounted) {
    return null
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
    router.refresh()
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "manager"] },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, roles: ["admin", "manager"] },
    { name: "Monthly Summary", href: "/dashboard/monthly-summary", icon: BarChart, roles: ["admin", "manager"] },
    { name: "Companies", href: "/dashboard/companies", icon: Building2, roles: ["admin"] },
    { name: "Employees", href: "/dashboard/employees", icon: Users, roles: ["admin"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
    { name: "Diagnostics", href: "/dashboard/diagnostics", icon: Activity, roles: ["admin"] },
  ].filter((item) => item.roles.includes(userRole as string))

  return (
    <div className="min-h-[100dvh] flex bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5">
          <div className="flex items-center justify-center flex-shrink-0 px-4">
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
          <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-white shadow-sm">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[80vw] max-w-[300px]">
          <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-center p-4">
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
            <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
