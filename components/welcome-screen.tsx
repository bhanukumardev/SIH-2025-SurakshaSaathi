"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { LanguageSelector } from "@/components/language-selector"
import { RegionSelector } from "@/components/region-selector"
import { PeacockFeatherIcon, LotusIcon, TricolorStripe } from "@/components/cultural-elements"
import { PhulkariIcon, WheatStalkIcon, PhulkariPattern } from "@/components/punjab-cultural-elements"
import { useLocalization } from "@/hooks/use-localization"
import type { UserRole } from "@/lib/auth"

export function WelcomeScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const { t, greeting, config } = useLocalization()

  const roles = [
    {
      role: "student" as UserRole,
      title: t("student"),
      description: "Access learning modules, take quizzes, and participate in emergency drills",
      icon: "🎓",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      role: "teacher" as UserRole,
      title: t("teacher"),
      description: "Manage classes, assign modules, and conduct emergency drills",
      icon: "👨‍🏫",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      role: "parent" as UserRole,
      title: t("parent"),
      description: "Monitor child's progress and receive safety notifications",
      icon: "👨‍👩‍👧‍👦",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      role: "administrator" as UserRole,
      title: t("administrator"),
      description: "Oversee institutional preparedness and manage system-wide settings",
      icon: "⚙️",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    },
  ]

  if (showLogin && selectedRole) {
    return <LoginForm role={selectedRole} onBack={() => setShowLogin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      {/* Header with cultural elements */}
      <header className="relative overflow-hidden">
        <TricolorStripe className="h-2" />
        <div
          className={
            config.region === "punjab" ? "absolute inset-0 opacity-30" : "peacock-pattern absolute inset-0 opacity-30"
          }
        >
          {config.region === "punjab" && <PhulkariPattern />}
        </div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {config.region === "punjab" ? (
                  <>
                    <PhulkariIcon className="w-10 h-10 text-primary" />
                    <WheatStalkIcon className="w-8 h-8 text-secondary" />
                  </>
                ) : (
                  <>
                    <PeacockFeatherIcon className="w-10 h-10 text-primary" />
                    <LotusIcon className="w-8 h-8 text-secondary" />
                  </>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  {config.region === "punjab" && config.language === "pa" ? "ਸੁਰੱਖਿਆ ਸਾਥੀ" : "Suraksha Sathi"}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {config.region === "punjab" && config.language === "pa"
                    ? "ਡਿਜੀਟਲ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਪਲੇਟਫਾਰਮ"
                    : "Digital Disaster Management Platform"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <RegionSelector />
            </div>
          </div>

          {/* Welcome message with cultural greeting */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              {greeting}! {t("welcome")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {config.language === "hi"
                ? "भारत के स्कूलों और कॉलेजों के लिए एक व्यापक आपदा प्रबंधन शिक्षा मंच"
                : config.language === "pa"
                  ? "ਭਾਰਤ ਦੇ ਸਕੂਲਾਂ ਅਤੇ ਕਾਲਜਾਂ ਲਈ ਇੱਕ ਵਿਆਪਕ ਆਫ਼ਤ ਪ੍ਰਬੰਧਨ ਸਿੱਖਿਆ ਪਲੇਟਫਾਰਮ"
                  : "A comprehensive disaster management education platform for schools and colleges across India"}
            </p>
          </div>
        </div>
      </header>

      {/* Role selection */}
      <main className="container mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-foreground mb-2">Choose Your Role</h3>
          <p className="text-muted-foreground">Select your role to access personalized features</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {roles.map((roleData) => (
            <Card
              key={roleData.role}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${roleData.color} ${
                selectedRole === roleData.role ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => setSelectedRole(roleData.role)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{roleData.icon}</div>
                <CardTitle className="text-xl">{roleData.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm leading-relaxed">
                  {roleData.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedRole && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              Continue as {roles.find((r) => r.role === selectedRole)?.title}
            </Button>
          </div>
        )}

        {/* Cultural footer */}
        <footer className="mt-16 text-center">
          <div
            className={
              config.region === "punjab"
                ? "h-16 rounded-lg mb-4 opacity-20"
                : "phulkari-pattern h-16 rounded-lg mb-4 opacity-20"
            }
          >
            {config.region === "punjab" && <PhulkariPattern className="h-16 rounded-lg" />}
          </div>
          <p className="text-muted-foreground text-sm">
            {config.language === "hi"
              ? "सुरक्षित भारत, तैयार भारत"
              : config.language === "pa"
                ? "ਸੁਰੱਖਿਤ ਭਾਰਤ, ਤਿਆਰ ਭਾਰਤ"
                : "Safe India, Prepared India"}
          </p>
        </footer>
      </main>
    </div>
  )
}
