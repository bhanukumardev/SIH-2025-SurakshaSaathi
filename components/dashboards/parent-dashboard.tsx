"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Shield,
  Bell,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  MessageSquare,
  Heart,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalization } from "@/hooks/use-localization"
import { DashboardHeader } from "@/components/dashboard-header"
import { TricolorStripe } from "@/components/cultural-elements"
import { getEmergencyContacts, getLocalizedContactName } from "@/lib/regional-emergency-contacts"
import { RegionalDisasterAlerts } from "@/components/regional-disaster-alerts"

export function ParentDashboard() {
  const { user } = useAuth()
  const { t, config } = useLocalization()

  // Mock child data - in real app would come from API
  const children = [
    {
      id: 1,
      name: "Arjun Sharma",
      class: "10-A",
      school: "Delhi Public School",
      preparednessScore: 85,
      modulesCompleted: 8,
      totalModules: 10,
      lastActive: "2 hours ago",
      recentAchievements: ["Safety Champion", "Quiz Master"],
    },
    {
      id: 2,
      name: "Priya Sharma",
      class: "8-B",
      school: "Delhi Public School",
      preparednessScore: 92,
      modulesCompleted: 6,
      totalModules: 8,
      lastActive: "1 hour ago",
      recentAchievements: ["Knowledge Seeker"],
    },
  ]

  const [selectedChild, setSelectedChild] = useState(children[0])

  const safetyNotifications = [
    {
      id: 1,
      type: "alert",
      title:
        config.language === "hi"
          ? "भारी बारिश की चेतावनी - दिल्ली"
          : config.language === "pa"
            ? "ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਚੇਤਾਵਨੀ - ਦਿੱਲੀ"
            : "Heavy Rainfall Alert - Delhi",
      message:
        config.language === "hi"
          ? "अगले 24 घंटों में भारी बारिश की संभावना। स्कूल जल्दी बंद हो सकता है।"
          : config.language === "pa"
            ? "ਅਗਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ। ਸਕੂਲ ਜਲਦੀ ਬੰਦ ਹੋ ਸਕਦਾ ਹੈ।"
            : "Heavy rainfall expected in next 24 hours. School may close early.",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "info",
      title:
        config.language === "hi"
          ? "आपातकालीन अभ्यास सूचना"
          : config.language === "pa"
            ? "ਐਮਰਜੈਂਸੀ ਅਭਿਆਸ ਸੂਚਨਾ"
            : "Emergency Drill Notification",
      message:
        config.language === "hi"
          ? "कल सुबह 10:30 बजे आग सुरक्षा अभ्यास होगा।"
          : config.language === "pa"
            ? "ਕੱਲ੍ਹ ਸਵੇਰੇ 10:30 ਵਜੇ ਅੱਗ ਸੁਰੱਖਿਆ ਅਭਿਆਸ ਹੋਵੇਗਾ।"
            : "Fire safety drill scheduled for tomorrow at 10:30 AM.",
      time: "1 day ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "success",
      title:
        config.language === "hi"
          ? "मॉड्यूल पूरा किया गया"
          : config.language === "pa"
            ? "ਮਾਡਿਊਲ ਪੂਰਾ ਕੀਤਾ ਗਿਆ"
            : "Module Completed",
      message:
        config.language === "hi"
          ? `${selectedChild.name} ने भूकंप सुरक्षा मॉड्यूल पूरा किया।`
          : config.language === "pa"
            ? `${selectedChild.name} ਨੇ ਭੂਚਾਲ ਸੁਰੱਖਿਆ ਮਾਡਿਊਲ ਪੂਰਾ ਕੀਤਾ।`
            : `${selectedChild.name} completed Earthquake Safety module.`,
      time: "3 hours ago",
      priority: "low",
    },
  ]

  const emergencyContacts = getEmergencyContacts(config.region)

  const recentActivities = [
    {
      id: 1,
      type: "achievement",
      title: "New Badge Earned",
      description: `${selectedChild.name} earned the "Safety Champion" badge`,
      time: "2 hours ago",
      icon: Award,
    },
    {
      id: 2,
      type: "module",
      title: "Module Completed",
      description: "Completed Earthquake Safety Basics with 92% score",
      time: "1 day ago",
      icon: BookOpen,
    },
    {
      id: 3,
      type: "drill",
      title: "Drill Participation",
      description: "Participated in Fire Safety drill",
      time: "3 days ago",
      icon: Target,
    },
    {
      id: 4,
      type: "quiz",
      title: "Quiz Completed",
      description: "Scored 85% in Flood Safety quiz",
      time: "5 days ago",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <TricolorStripe className="h-1" />
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {config.language === "hi"
              ? `नमस्ते, ${user?.name}!`
              : config.language === "pa"
                ? `ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ${user?.name}!`
                : `Welcome, ${user?.name}!`}
          </h1>
          <p className="text-muted-foreground">
            {config.language === "hi"
              ? "अपने बच्चे की सुरक्षा यात्रा पर नज़र रखें"
              : config.language === "pa"
                ? "ਆਪਣੇ ਬੱਚੇ ਦੀ ਸੁਰੱਖਿਆ ਯਾਤਰਾ 'ਤੇ ਨਜ਼ਰ ਰੱਖੋ"
                : "Monitor your child's safety journey"}
          </p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="mb-6">
            <div className="flex space-x-4">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild.id === child.id ? "default" : "outline"}
                  onClick={() => setSelectedChild(child)}
                  className="flex items-center space-x-2"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{child.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Child Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Preparedness Score</p>
                  <p className="text-2xl font-bold text-blue-900">{selectedChild.preparednessScore}%</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <Progress value={selectedChild.preparednessScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Modules Progress</p>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedChild.modulesCompleted}/{selectedChild.totalModules}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <Progress value={(selectedChild.modulesCompleted / selectedChild.totalModules) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Achievements</p>
                  <p className="text-2xl font-bold text-orange-900">{selectedChild.recentAchievements.length}</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Last Active</p>
                  <p className="text-lg font-bold text-purple-900">{selectedChild.lastActive}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Communication</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <span>Safety Notifications</span>
                </CardTitle>
                <CardDescription>Real-time updates about safety alerts and your child's activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {safetyNotifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    className={
                      notification.priority === "high"
                        ? "border-red-200 bg-red-50"
                        : notification.priority === "medium"
                          ? "border-orange-200 bg-orange-50"
                          : notification.type === "success"
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50"
                    }
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            notification.priority === "high"
                              ? "destructive"
                              : notification.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {notification.priority === "high"
                            ? "High Priority"
                            : notification.priority === "medium"
                              ? "Medium"
                              : "Info"}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>{selectedChild.name}'s safety education journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Preparedness</span>
                      <span className="text-2xl font-bold text-primary">{selectedChild.preparednessScore}%</span>
                    </div>
                    <Progress value={selectedChild.preparednessScore} className="w-full" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedChild.modulesCompleted}</p>
                        <p className="text-sm text-muted-foreground">Modules Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedChild.recentAchievements.length}</p>
                        <p className="text-sm text-muted-foreground">Badges Earned</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest achievements and learning milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <activity.icon className="w-5 h-5 text-primary mt-0.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Emergency Contacts</span>
                  </CardTitle>
                  <CardDescription>
                    {config.region === "punjab"
                      ? "Punjab regional and national emergency numbers"
                      : "Important emergency numbers and contacts for your region"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {getLocalizedContactName(contact, config.language)}
                          </h4>
                          <Badge variant="outline">{contact.type}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="text-lg font-mono font-bold text-primary">{contact.number}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{contact.available}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <RegionalDisasterAlerts />
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>School Communication</CardTitle>
                  <CardDescription>Messages and updates from {selectedChild.school}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>T</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Mrs. Priya Singh (Class Teacher)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedChild.name} showed excellent participation in today's earthquake drill. Well done!
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">School Administration</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reminder: Parent-teacher meeting scheduled for next Friday to discuss safety preparedness.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Family Safety Plan</CardTitle>
                  <CardDescription>Your personalized family emergency plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Emergency Kit Ready</p>
                        <p className="text-xs text-green-600">Last updated 2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Meeting Point Set</p>
                        <p className="text-xs text-blue-600">Community Park, Sector 15</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Heart className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Family Contacts Updated</p>
                        <p className="text-xs text-orange-600">3 emergency contacts added</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Update Family Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
