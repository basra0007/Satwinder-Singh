import { supabase } from "./supabase"

export async function testSupabaseConnection(): Promise<{
  success: boolean
  message: string
  details?: any
}> {
  try {
    console.log("Testing Supabase connection...")

    // Test basic connection
    const { data, error } = await supabase.from("companies").select("count").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: error,
      }
    }

    console.log("Supabase connection successful!")
    return {
      success: true,
      message: "Successfully connected to Supabase",
      details: data,
    }
  } catch (error: any) {
    console.error("Unexpected error testing connection:", error)
    return {
      success: false,
      message: `Unexpected error: ${error.message || "Unknown error"}`,
      details: error,
    }
  }
}

export async function checkTablePermissions(): Promise<{
  companies: boolean
  employees: boolean
  orders: boolean
  errors: string[]
}> {
  const errors: string[] = []
  let companiesOk = false
  let employeesOk = false
  let ordersOk = false

  try {
    // Test companies table
    const { error: compError } = await supabase.from("companies").select("count").limit(1)
    if (compError) {
      errors.push(`Companies table: ${compError.message}`)
    } else {
      companiesOk = true
    }

    // Test employees table
    const { error: empError } = await supabase.from("employees").select("count").limit(1)
    if (empError) {
      errors.push(`Employees table: ${empError.message}`)
    } else {
      employeesOk = true
    }

    // Test orders table
    const { error: ordError } = await supabase.from("orders").select("count").limit(1)
    if (ordError) {
      errors.push(`Orders table: ${ordError.message}`)
    } else {
      ordersOk = true
    }
  } catch (error: any) {
    errors.push(`Unexpected error: ${error.message}`)
  }

  return {
    companies: companiesOk,
    employees: employeesOk,
    orders: ordersOk,
    errors,
  }
}
