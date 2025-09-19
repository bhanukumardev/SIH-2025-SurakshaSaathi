"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type Language,
  type Region,
  type LocalizationConfig,
  getTranslation,
  getRegionalGreeting,
} from "@/lib/localization"

interface LocalizationContextType {
  config: LocalizationConfig
  setLanguage: (language: Language) => void
  setRegion: (region: Region) => void
  t: (key: keyof typeof import("@/lib/localization").translations.en) => string
  greeting: string
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined)

export const LocalizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<LocalizationConfig>({
    language: "en",
    region: "national",
  })

  useEffect(() => {
    // Load saved preferences
    const savedConfig = localStorage.getItem("suraksha-localization")
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch {
        // Use defaults
      }
    }
  }, [])

  const setLanguage = (language: Language) => {
    const newConfig = { ...config, language }
    setConfig(newConfig)
    localStorage.setItem("suraksha-localization", JSON.stringify(newConfig))
  }

  const setRegion = (region: Region) => {
    const newConfig = { ...config, region }
    setConfig(newConfig)
    localStorage.setItem("suraksha-localization", JSON.stringify(newConfig))
  }

  const t = (key: keyof typeof import("@/lib/localization").translations.en) => {
    return getTranslation(key, config.language)
  }

  const greeting = getRegionalGreeting(config.region, config.language)

  return (
    <LocalizationContext.Provider
      value={{
        config,
        setLanguage,
        setRegion,
        t,
        greeting,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => {
  const context = useContext(LocalizationContext)
  if (context === undefined) {
    throw new Error("useLocalization must be used within a LocalizationProvider")
  }
  return context
}
