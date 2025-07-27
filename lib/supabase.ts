import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Company {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  address: string
  price_per_item: number
  status: "active" | "inactive"
  created_at?: string
  updated_at?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: "admin" | "manager" | "staff"
  status: "active" | "inactive"
  start_date: string
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  company_id: string
  company_name: string
  date: string
  items: any[] // JSON field
  total_amount: number
  status: "completed" | "processing" | "cancelled"
  type: "delivery" | "pickup" | "dine-in"
  delivery_address?: string
  notes?: string
  created_at?: string
  updated_at?: string
}
