"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MapPin } from "lucide-react"
import { useLocalization } from "@/hooks/use-localization"
import type { Region } from "@/lib/localization"

export function RegionSelector() {
  const { config, setRegion } = useLocalization()

  const regions = [
    { code: "national" as Region, name: "National", native: "भारत" },
    { code: "punjab" as Region, name: "Punjab", native: "ਪੰਜਾਬ" },
  ]

  const currentRegion = regions.find((region) => region.code === config.region)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
          <MapPin className="w-4 h-4" />
          <span>{currentRegion?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.code}
            onClick={() => setRegion(region.code)}
            className={config.region === region.code ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{region.name}</span>
              <span className="text-xs text-muted-foreground">{region.native}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
