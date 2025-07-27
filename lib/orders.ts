import { type Order, addStoredOrder as addOrder } from "./storage"

export function generateId(): string {
  return `order_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`
}

export function addStoredOrder(order: Order) {
  addOrder(order)
}
