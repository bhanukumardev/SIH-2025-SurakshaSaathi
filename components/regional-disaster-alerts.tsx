"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Clock, Thermometer, Droplets, Mountain } from "lucide-react"
import { useLocalization } from "@/hooks/use-localization"
import { getRegionalDisasters } from "@/lib/regional-disaster-data"
import { PhulkariIcon, WheatStalkIcon } from "@/components/punjab-cultural-elements"

export function RegionalDisasterAlerts() {
  const { config, t } = useLocalization()
  const regionalDisasters = getRegionalDisasters(config.region)

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case "flood":
        return <Droplets className="w-4 h-4" />
      case "earthquake":
        return <Mountain className="w-4 h-4" />
      case "heatwave":
        return <Thermometer className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      case "low":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {config.region === "punjab" ? (
            <>
              <PhulkariIcon className="w-5 h-5 text-primary" />
              <WheatStalkIcon className="w-5 h-5 text-secondary" />
            </>
          ) : (
            <MapPin className="w-5 h-5 text-primary" />
          )}
          <CardTitle>
            {config.region === "punjab"
              ? config.language === "pa"
                ? "ਪੰਜਾਬ ਖੇਤਰੀ ਚੇਤਾਵਨੀਆਂ"
                : config.language === "hi"
                  ? "पंजाब क्षेत्रीय चेतावनियां"
                  : "Punjab Regional Alerts"
              : "Regional Disaster Alerts"}
          </CardTitle>
        </div>
        <CardDescription>
          {config.region === "punjab"
            ? config.language === "pa"
              ? "ਪੰਜਾਬ ਖੇਤਰ ਲਈ ਵਿਸ਼ੇਸ਼ ਆਫ਼ਤ ਜਾਣਕਾਰੀ"
              : config.language === "hi"
                ? "पंजाब क्षेत्र के लिए विशेष आपदा जानकारी"
                : "Specialized disaster information for Punjab region"
            : "Disaster alerts specific to your region"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {regionalDisasters.map((disaster) => (
          <Alert key={disaster.id} className={getSeverityColor(disaster.severity)}>
            {getDisasterIcon(disaster.type)}
            <AlertDescription>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{disaster.title[config.language]}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{disaster.description[config.language]}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    {disaster.seasonality && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{disaster.seasonality}</span>
                      </span>
                    )}
                    <span>Frequency: {disaster.frequency}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">
                      {config.language === "pa"
                        ? "ਤਿਆਰੀ ਦੇ ਸੁਝਾਅ:"
                        : config.language === "hi"
                          ? "तैयारी के सुझाव:"
                          : "Preparation Tips:"}
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {disaster.preparationTips[config.language].slice(0, 2).map((tip, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span>•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Badge
                  variant={
                    disaster.severity === "high"
                      ? "destructive"
                      : disaster.severity === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {disaster.severity === "high"
                    ? config.language === "pa"
                      ? "ਉੱਚ"
                      : config.language === "hi"
                        ? "उच्च"
                        : "High"
                    : disaster.severity === "medium"
                      ? config.language === "pa"
                        ? "ਮੱਧਮ"
                        : config.language === "hi"
                          ? "मध्यम"
                          : "Medium"
                      : config.language === "pa"
                        ? "ਘੱਟ"
                        : config.language === "hi"
                          ? "कम"
                          : "Low"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
