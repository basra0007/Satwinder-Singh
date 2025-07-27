import { supabase, type Company, type Employee, type Order } from "./supabase"

// Company functions
export async function getStoredCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching companies:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredCompanies:", error)
    return []
  }
}

export async function setStoredCompanies(companies: Company[]): Promise<void> {
  // This function is kept for compatibility but individual operations are preferred
  console.warn("setStoredCompanies is deprecated. Use addCompany, updateCompany, deleteCompany instead.")
}

export async function addCompany(company: Omit<Company, "id" | "created_at" | "updated_at">): Promise<Company | null> {
  try {
    const { data, error } = await supabase.from("companies").insert([company]).select().single()

    if (error) {
      console.error("Error adding company:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in addCompany:", error)
    return null
  }
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
  try {
    const { data, error } = await supabase
      .from("companies")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating company:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateCompany:", error)
    return null
  }
}

export async function deleteCompany(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("companies").delete().eq("id", id)

    if (error) {
      console.error("Error deleting company:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteCompany:", error)
    return false
  }
}

// Employee functions
export async function getStoredEmployees(): Promise<Employee[]> {
  try {
    const { data, error } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching employees:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredEmployees:", error)
    return []
  }
}

export async function setStoredEmployees(employees: Employee[]): Promise<void> {
  // This function is kept for compatibility but individual operations are preferred
  console.warn("setStoredEmployees is deprecated. Use addEmployee, updateEmployee, deleteEmployee instead.")
}

export async function addEmployee(
  employee: Omit<Employee, "id" | "created_at" | "updated_at">,
): Promise<Employee | null> {
  try {
    const { data, error } = await supabase.from("employees").insert([employee]).select().single()

    if (error) {
      console.error("Error adding employee:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in addEmployee:", error)
    return null
  }
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  try {
    const { data, error } = await supabase
      .from("employees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating employee:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateEmployee:", error)
    return null
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("employees").delete().eq("id", id)

    if (error) {
      console.error("Error deleting employee:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteEmployee:", error)
    return false
  }
}

// Order functions
export async function getStoredOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getStoredOrders:", error)
    return []
  }
}

export async function setStoredOrders(orders: Order[]): Promise<void> {
  // This function is kept for compatibility but individual operations are preferred
  console.warn("setStoredOrders is deprecated. Use addStoredOrder, updateStoredOrder, deleteStoredOrder instead.")
}

export async function addStoredOrder(order: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order | null> {
  try {
    const { data, error } = await supabase.from("orders").insert([order]).select().single()

    if (error) {
      console.error("Error adding order:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in addStoredOrder:", error)
    return null
  }
}

export async function updateStoredOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateStoredOrder:", error)
    return null
  }
}

export async function deleteStoredOrder(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").delete().eq("id", id)

    if (error) {
      console.error("Error deleting order:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteStoredOrder:", error)
    return false
  }
}

// Legacy interfaces for compatibility
export type { Company, Employee, Order }
