"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { isAuthenticated, getUserRole } from "@/lib/cookies"
import { testSupabaseConnection, checkTablePermissions } from "@/lib/supabase-test"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DiagnosticsPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [permissionsResult, setPermissionsResult] = useState<any>(null)

  useEffect(() => {
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
    setIsLoading(false)
  }, [router])

  const runDiagnostics = async () => {
    setTesting(true)

    // Test connection
    const connResult = await testSupabaseConnection()
    setConnectionResult(connResult)

    // Check permissions
    const permResult = await checkTablePermissions()
    setPermissionsResult(permResult)

    setTesting(false)
  }

  if (isLoading || !isAdmin) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Diagnostics</h2>
            <p className="text-muted-foreground">Check your database connection and permissions</p>
          </div>
          <Button onClick={runDiagnostics} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Diagnostics"
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if Supabase credentials are configured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Missing
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Missing
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {connectionResult && (
          <Card>
            <CardHeader>
              <CardTitle>Connection Test</CardTitle>
              <CardDescription>Database connection status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {connectionResult.success ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">{connectionResult.message}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">{connectionResult.message}</span>
                    </>
                  )}
                </div>
                {connectionResult.details && (
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(connectionResult.details, null, 2)}
                  </pre>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {permissionsResult && (
          <Card>
            <CardHeader>
              <CardTitle>Table Permissions</CardTitle>
              <CardDescription>Check access to database tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Companies Table</span>
                  {permissionsResult.companies ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Accessible
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      No Access
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Employees Table</span>
                  {permissionsResult.employees ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Accessible
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      No Access
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Orders Table</span>
                  {permissionsResult.orders ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Accessible
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      No Access
                    </Badge>
                  )}
                </div>

                {permissionsResult.errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-900">Errors Found:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-800 mt-2">
                          {permissionsResult.errors.map((error: string, idx: number) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
            <CardDescription>If you're experiencing issues, try these steps</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Verify your Supabase environment variables are correctly set in your .env.local file</li>
              <li>Ensure the database tables have been created by running the SQL scripts</li>
              <li>Check that RLS (Row Level Security) policies are properly configured in Supabase</li>
              <li>Verify your Supabase project is active and not paused</li>
              <li>Check the browser console for any error messages</li>
              <li>Try clearing your browser cache and reloading the page</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
