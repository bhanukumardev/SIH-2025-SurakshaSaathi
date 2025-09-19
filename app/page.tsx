"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthProvider } from "@/hooks/use-auth"
import { LocalizationProvider } from "@/hooks/use-localization"
import { RegionalThemeProvider } from "@/components/regional-theme-provider"
import { WelcomeScreen } from "@/components/welcome-screen"
import { DashboardRouter } from "@/components/dashboard-router"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Suraksha Sathi...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <DashboardRouter /> : <WelcomeScreen />
}

export default function Home() {
  return (
    <LocalizationProvider>
      <RegionalThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RegionalThemeProvider>
    </LocalizationProvider>
  )
}
