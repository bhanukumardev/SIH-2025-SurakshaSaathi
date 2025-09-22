"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLocalization } from "@/hooks/use-localization"
import type { Language } from "@/lib/localization"

export function LanguageSelector() {
  const { config, setLanguage } = useLocalization()

  const languages = [
    { code: "en" as Language, name: "English", native: "English" },
    { code: "hi" as Language, name: "Hindi", native: "हिन्दी" },
    { code: "pa" as Language, name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === config.language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <Globe className="w-4 h-4" />
          <span>{currentLanguage?.native}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              console.log("Language selected:", language.code)
              setLanguage(language.code)
            }}
            className={config.language === language.code ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.native}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
