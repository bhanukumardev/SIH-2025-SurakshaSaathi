import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { LocalizationProvider } from "@/hooks/use-localization"

export const metadata: Metadata = {
  title: "Suraksha Sathi - Digital Disaster Management Platform",
  description: "A comprehensive disaster management learning platform for Indian schools and colleges",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <LocalizationProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </LocalizationProvider>
        <Analytics />
      </body>
    </html>
  )
}
