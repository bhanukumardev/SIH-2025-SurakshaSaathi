"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalization } from "@/hooks/use-localization"
import { PeacockFeatherIcon, TricolorStripe } from "@/components/cultural-elements"
import type { UserRole } from "@/lib/auth"

interface LoginFormProps {
  role: UserRole
  onBack: () => void
}

export function LoginForm({ role, onBack }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { t, greeting, config } = useLocalization()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Invalid email or password. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return "🎓"
      case "teacher":
        return "👨‍🏫"
      case "parent":
        return "👨‍👩‍👧‍👦"
      case "administrator":
        return "⚙️"
      default:
        return "👤"
    }
  }

  const demoCredentials = {
    student: { email: "arjun@school.edu", password: "demo123" },
    teacher: { email: "priya@school.edu", password: "demo123" },
    parent: { email: "rajesh@parent.com", password: "demo123" },
    administrator: { email: "sunita@admin.edu", password: "demo123" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <TricolorStripe className="h-2" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PeacockFeatherIcon className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                {config.region === "punjab" && config.language === "pa" ? "ਸੁਰੱਖਿਆ ਸਾਥੀ" : "Suraksha Sathi"}
              </h1>
            </div>
            <p className="text-muted-foreground">{greeting}!</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Button variant="ghost" size="sm" onClick={onBack} className="absolute left-4 top-4">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="text-3xl">{getRoleIcon(role)}</div>
              </div>
              <CardTitle className="text-xl">
                {t("login")} as {t(role)}
              </CardTitle>
              <CardDescription>Enter your credentials to access your dashboard</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : t("login")}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>Email:</strong> {demoCredentials[role].email}
                  </p>
                  <p>
                    <strong>Password:</strong> {demoCredentials[role].password}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-transparent"
                  onClick={() => {
                    setEmail(demoCredentials[role].email)
                    setPassword(demoCredentials[role].password)
                  }}
                >
                  Use Demo Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cultural footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {config.language === "hi"
                ? "सुरक्षित भारत, तैयार भारत"
                : config.language === "pa"
                  ? "ਸੁਰੱਖਿਤ ਭਾਰਤ, ਤਿਆਰ ਭਾਰਤ"
                  : "Safe India, Prepared India"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
