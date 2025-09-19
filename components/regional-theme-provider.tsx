"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useLocalization } from "@/hooks/use-localization"

interface RegionalThemeContextType {
  applyRegionalTheme: () => void
}

const RegionalThemeContext = createContext<RegionalThemeContextType | undefined>(undefined)

export const RegionalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { config } = useLocalization()

  const applyRegionalTheme = () => {
    const root = document.documentElement

    if (config.region === "punjab") {
      // Punjab-specific color overrides
      root.style.setProperty("--primary", "#D2691E") // Saffron with Punjab warmth
      root.style.setProperty("--secondary", "#228B22") // Forest green
      root.style.setProperty("--accent", "#8B4513") // Saddle brown for earthiness
      root.style.setProperty("--cultural-gold", "#DAA520") // Goldenrod
      root.style.setProperty("--cultural-red", "#B22222") // Fire brick red
    } else {
      // National theme (default)
      root.style.setProperty("--primary", "#FF9933") // Standard saffron
      root.style.setProperty("--secondary", "#138808") // Standard green
      root.style.setProperty("--accent", "#000080") // Navy blue
      root.style.setProperty("--cultural-gold", "#FFD700") // Gold
      root.style.setProperty("--cultural-red", "#DC143C") // Crimson
    }
  }

  useEffect(() => {
    applyRegionalTheme()
  }, [config.region])

  return <RegionalThemeContext.Provider value={{ applyRegionalTheme }}>{children}</RegionalThemeContext.Provider>
}

export const useRegionalTheme = () => {
  const context = useContext(RegionalThemeContext)
  if (context === undefined) {
    throw new Error("useRegionalTheme must be used within a RegionalThemeProvider")
  }
  return context
}
