"use client"

export function setAuth(role: "admin" | "manager") {
  // Set cookies with proper attributes
  document.cookie = `isAuthenticated=true; path=/`
  document.cookie = `userRole=${role}; path=/`
}

export function clearAuth() {
  // Clear cookies
  document.cookie = "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}
