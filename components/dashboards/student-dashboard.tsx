"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Shield, Trophy, Calendar, BookOpen, Target, Bell, Award, Clock, MapPin } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalization } from "@/hooks/use-localization"
import { DashboardHeader } from "@/components/dashboard-header"
import { TricolorStripe } from "@/components/cultural-elements"

export function StudentDashboard() {
  const { user } = useAuth()
  const { t, config } = useLocalization()
  const [preparednessScore] = useState(78)

  const alerts = [
    {
      id: 1,
      type: "warning",
      title:
        config.language === "hi"
          ? "भारी बारिश की चेतावनी"
          : config.language === "pa"
            ? "ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਚੇਤਾਵਨੀ"
            : "Heavy Rainfall Warning",
      description:
        config.language === "hi"
          ? "अगले 24 घंटों में भारी बारिश की संभावना"
          : config.language === "pa"
            ? "ਅਗਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ"
            : "Heavy rainfall expected in next 24 hours",
      region: "Delhi NCR",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      title:
        config.language === "hi"
          ? "भूकंप तैयारी सप्ताह"
          : config.language === "pa"
            ? "ਭੂਚਾਲ ਤਿਆਰੀ ਹਫ਼ਤਾ"
            : "Earthquake Preparedness Week",
      description:
        config.language === "hi"
          ? "इस सप्ताह भूकंप सुरक्षा के बारे में जानें"
          : config.language === "pa"
            ? "ਇਸ ਹਫ਼ਤੇ ਭੂਚਾਲ ਸੁਰੱਖਿਆ ਬਾਰੇ ਜਾਣੋ"
            : "Learn about earthquake safety this week",
      region: "National",
      time: "1 day ago",
    },
  ]

  const upcomingDrills = [
    {
      id: 1,
      title:
        config.language === "hi" ? "आग सुरक्षा अभ्यास" : config.language === "pa" ? "ਅੱਗ ਸੁਰੱਖਿਆ ਅਭਿਆਸ" : "Fire Safety Drill",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Fire Emergency",
    },
    {
      id: 2,
      title: config.language === "hi" ? "भूकंप अभ्यास" : config.language === "pa" ? "ਭੂਚਾਲ ਅਭਿਆਸ" : "Earthquake Drill",
      date: "Friday",
      time: "2:00 PM",
      type: "Earthquake",
    },
  ]

  const quizzes = [
    {
      id: 1,
      title:
        config.language === "hi"
          ? "बाढ़ सुरक्षा प्रश्नोत्तरी"
          : config.language === "pa"
            ? "ਹੜ੍ਹ ਸੁਰੱਖਿਆ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ"
            : "Flood Safety Quiz",
      questions: 10,
      timeLimit: "15 min",
      points: 100,
      completed: false,
      difficulty: "Beginner",
    },
    {
      id: 2,
      title:
        config.language === "hi"
          ? "आपातकालीन किट प्रश्नोत्तरी"
          : config.language === "pa"
            ? "ਐਮਰਜੈਂਸੀ ਕਿੱਟ ਪ੍ਰਸ਼ਨ-ਉੱਤਰ"
            : "Emergency Kit Quiz",
      questions: 8,
      timeLimit: "10 min",
      points: 80,
      completed: true,
      score: 75,
      difficulty: "Intermediate",
    },
  ]

  const achievements = [
    { id: 1, title: "Safety Champion", icon: "🏆", earned: true },
    { id: 2, title: "Quiz Master", icon: "🧠", earned: true },
    { id: 3, title: "Drill Participant", icon: "🎯", earned: false },
    { id: 4, title: "Knowledge Seeker", icon: "📚", earned: true },
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
              ? "आज आपकी सुरक्षा यात्रा जारी रखें"
              : config.language === "pa"
                ? "ਅੱਜ ਆਪਣੀ ਸੁਰੱਖਿਆ ਯਾਤਰਾ ਜਾਰੀ ਰੱਖੋ"
                : "Continue your safety journey today"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Preparedness Score</p>
                  <p className="text-2xl font-bold text-blue-900">{preparednessScore}%</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <Progress value={preparednessScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold text-green-900">12</p>
                </div>
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Drills Attended</p>
                  <p className="text-2xl font-bold text-orange-900">8</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Points</p>
                  <p className="text-2xl font-bold text-purple-900">2,450</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>{t("alerts")}</span>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>{t("quiz")}</span>
            </TabsTrigger>
            <TabsTrigger value="drills" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{t("drills")}</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span>Disaster Alerts</span>
                </CardTitle>
                <CardDescription>Stay informed about current and upcoming disasters in your region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={
                      alert.type === "warning" ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"
                    }
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{alert.region}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{alert.time}</span>
                            </span>
                          </div>
                        </div>
                        <Badge variant={alert.type === "warning" ? "destructive" : "secondary"}>
                          {alert.type === "warning" ? "Warning" : "Info"}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Learning Quizzes</CardTitle>
                <CardDescription>Test your disaster preparedness knowledge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{quiz.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{quiz.questions} questions</span>
                        <span>{quiz.timeLimit}</span>
                        <span>{quiz.points} points</span>
                        <Badge variant="outline">{quiz.difficulty}</Badge>
                      </div>
                      {quiz.completed && quiz.score && (
                        <p className="text-sm text-green-600 mt-1">Completed: {quiz.score}% score</p>
                      )}
                    </div>
                    <Button
                      variant={quiz.completed ? "outline" : "default"}
                      className={quiz.completed ? "" : "bg-primary hover:bg-primary/90"}
                    >
                      {quiz.completed ? "Retake" : "Start Quiz"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Emergency Drills</CardTitle>
                <CardDescription>Scheduled virtual and physical emergency drills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDrills.map((drill) => (
                  <div key={drill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{drill.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{drill.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{drill.time}</span>
                        </span>
                        <Badge variant="outline">{drill.type}</Badge>
                      </div>
                    </div>
                    <Button variant="outline">Set Reminder</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges earned through your safety learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`text-center p-4 rounded-lg border ${
                        achievement.earned
                          ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
                          : "bg-gray-50 border-gray-200 opacity-50"
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2 bg-yellow-200 text-yellow-800">
                          Earned
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
