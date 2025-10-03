import { supabase, type Company, type Employee, type Order } from "./supabase"

// Company functions
export async function getStoredCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching companies:", error)
      throw new Error(`Failed to fetch companies: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredCompanies:", error)
    return []
  }
}

export async function setStoredCompanies(companies: Company[]): Promise<void> {
  console.warn("setStoredCompanies is deprecated. Use addCompany, updateCompany, deleteCompany instead.")
}

export async function addCompany(company: Omit<Company, "id" | "created_at" | "updated_at">): Promise<Company | null> {
  try {
    console.log("Attempting to add company:", company)

    const { data, error } = await supabase.from("companies").insert([company]).select().single()

    if (error) {
      console.error("Supabase error adding company:", error)
      throw new Error(`Failed to add company: ${error.message}`)
    }

    console.log("Company added successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in addCompany:", error)
    alert(`Error adding company: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
  try {
    console.log("Attempting to update company:", id, updates)

    const { data, error } = await supabase
      .from("companies")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error updating company:", error)
      throw new Error(`Failed to update company: ${error.message}`)
    }

    console.log("Company updated successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in updateCompany:", error)
    alert(`Error updating company: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function deleteCompany(id: string): Promise<boolean> {
  try {
    console.log("Attempting to delete company:", id)

    const { error } = await supabase.from("companies").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting company:", error)
      throw new Error(`Failed to delete company: ${error.message}`)
    }

    console.log("Company deleted successfully")
    return true
  } catch (error: any) {
    console.error("Error in deleteCompany:", error)
    alert(`Error deleting company: ${error.message || "Unknown error occurred"}`)
    return false
  }
}

// Employee functions
export async function getStoredEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching employees:", error)
      throw new Error(`Failed to fetch employees: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredEmployees:", error)
    return []
  }
}

export async function setStoredEmployees(employees: Employee[]): Promise<void> {
  console.warn("setStoredEmployees is deprecated. Use addEmployee, updateEmployee, deleteEmployee instead.")
}

export async function addEmployee(
  employee: Omit<Employee, "id" | "created_at" | "updated_at">,
): Promise<Employee | null> {
  try {
    console.log("Attempting to add employee:", employee)

    const { data, error } = await supabase.from("employees").insert([employee]).select().single()

    if (error) {
      console.error("Supabase error adding employee:", error)
      throw new Error(`Failed to add employee: ${error.message}`)
    }

    console.log("Employee added successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in addEmployee:", error)
    alert(`Error adding employee: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  try {
    console.log("Attempting to update employee:", id, updates)

    const { data, error } = await supabase
      .from("employees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error updating employee:", error)
      throw new Error(`Failed to update employee: ${error.message}`)
    }

    console.log("Employee updated successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in updateEmployee:", error)
    alert(`Error updating employee: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    console.log("Attempting to delete employee:", id)

    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting employee:", error)
      throw new Error(`Failed to delete employee: ${error.message}`)
    }

    console.log("Employee deleted successfully")
    return true
  } catch (error: any) {
    console.error("Error in deleteEmployee:", error)
    alert(`Error deleting employee: ${error.message || "Unknown error occurred"}`)
    return false
  }
}

// Order functions
export async function getStoredOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredOrders:", error)
    return []
  }
}

export async function setStoredOrders(orders: Order[]): Promise<void> {
  console.warn("setStoredOrders is deprecated. Use addStoredOrder, updateStoredOrder, deleteStoredOrder instead.")
}

export async function addStoredOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
  try {
    console.log("Attempting to add order:", order)

    const { data, error } = await supabase.from("orders").insert([order]).select().single()

    if (error) {
      console.error("Supabase error adding order:", error)
      throw new Error(`Failed to add order: ${error.message}`)
    }

    console.log("Order added successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in addStoredOrder:", error)
    alert(`Error adding order: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function updateStoredOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    console.log("Attempting to update order:", id, updates)

    const { data, error } = await supabase
      .from("orders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error updating order:", error)
      throw new Error(`Failed to update order: ${error.message}`)
    }

    console.log("Order updated successfully:", data)
    return data
  } catch (error: any) {
    console.error("Error in updateStoredOrder:", error)
    alert(`Error updating order: ${error.message || "Unknown error occurred"}`)
    return null
  }
}

export async function deleteStoredOrder(id: string): Promise<boolean> {
  try {
    console.log("Attempting to delete order:", id)

    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting order:", error)
      throw new Error(`Failed to delete order: ${error.message}`)
    }

    console.log("Order deleted successfully")
    return true
  } catch (error: any) {
    console.error("Error in deleteStoredOrder:", error)
    alert(`Error deleting order: ${error.message || "Unknown error occurred"}`)
    return false
  }
}

// Legacy interfaces for compatibility
export type { Company, Employee, Order }
