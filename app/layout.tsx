import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PWARegister } from "@/components/pwa-register"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Traditional Kitchen LTD",
  description: "Traditional Kitchen LTD - Order Management System",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Traditional Kitchen",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <PWARegister />
        {children}
      </body>
    </html>
  )
}
