"use client"

export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

export function getUserRole(): "admin" | "manager" | undefined {
  return getCookie("userRole") as "admin" | "manager" | undefined
}

export function isAuthenticated(): boolean {
  return getCookie("isAuthenticated") === "true"
}
