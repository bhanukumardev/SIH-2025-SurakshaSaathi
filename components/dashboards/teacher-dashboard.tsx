"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalization } from "@/hooks/use-localization"
import { DashboardHeader } from "@/components/dashboard-header"
import { TricolorStripe } from "@/components/cultural-elements"

export function TeacherDashboard() {
  const { user } = useAuth()
  const { t, config } = useLocalization()
  const [selectedClass, setSelectedClass] = useState("10-A")

  const classStats = {
    totalStudents: 35,
    activeStudents: 32,
    completedModules: 28,
    averageScore: 82,
    upcomingDrills: 2,
  }

  const students = [
    {
      id: 1,
      name: "Arjun Sharma",
      rollNo: "001",
      preparednessScore: 85,
      modulesCompleted: 8,
      lastActive: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Patel",
      rollNo: "002",
      preparednessScore: 92,
      modulesCompleted: 10,
      lastActive: "1 hour ago",
      status: "active",
    },
    {
      id: 3,
      name: "Rahul Singh",
      rollNo: "003",
      preparednessScore: 68,
      modulesCompleted: 6,
      lastActive: "1 day ago",
      status: "inactive",
    },
    {
      id: 4,
      name: "Anita Kumar",
      rollNo: "004",
      preparednessScore: 78,
      modulesCompleted: 7,
      lastActive: "3 hours ago",
      status: "active",
    },
  ]

  const modules = [
    {
      id: 1,
      title:
        config.language === "hi"
          ? "भूकंप सुरक्षा मूल बातें"
          : config.language === "pa"
            ? "ਭੂਚਾਲ ਸੁਰੱਖਿਆ ਮੂਲ ਗੱਲਾਂ"
            : "Earthquake Safety Basics",
      description: "Learn fundamental earthquake safety measures",
      duration: "30 min",
      difficulty: "Beginner",
      assigned: 35,
      completed: 28,
      category: "Natural Disasters",
    },
    {
      id: 2,
      title:
        config.language === "hi"
          ? "आपातकालीन किट तैयारी"
          : config.language === "pa"
            ? "ਐਮਰਜੈਂਸੀ ਕਿੱਟ ਤਿਆਰੀ"
            : "Emergency Kit Preparation",
      description: "How to prepare and maintain emergency kits",
      duration: "25 min",
      difficulty: "Beginner",
      assigned: 35,
      completed: 30,
      category: "Preparedness",
    },
    {
      id: 3,
      title:
        config.language === "hi" ? "बाढ़ से बचाव" : config.language === "pa" ? "ਹੜ੍ਹ ਤੋਂ ਬਚਾਅ" : "Flood Safety Measures",
      description: "Understanding flood risks and safety protocols",
      duration: "35 min",
      difficulty: "Intermediate",
      assigned: 20,
      completed: 15,
      category: "Natural Disasters",
    },
  ]

  const upcomingDrills = [
    {
      id: 1,
      title:
        config.language === "hi" ? "आग सुरक्षा अभ्यास" : config.language === "pa" ? "ਅੱਗ ਸੁਰੱਖਿਆ ਅਭਿਆਸ" : "Fire Safety Drill",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "Fire Emergency",
      participants: 35,
      status: "scheduled",
    },
    {
      id: 2,
      title: config.language === "hi" ? "भूकंप अभ्यास" : config.language === "pa" ? "ਭੂਚਾਲ ਅਭਿਆਸ" : "Earthquake Drill",
      date: "2024-01-18",
      time: "2:00 PM",
      type: "Earthquake",
      participants: 35,
      status: "scheduled",
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
              ? "अपनी कक्षा की सुरक्षा तैयारी का प्रबंधन करें"
              : config.language === "pa"
                ? "ਆਪਣੀ ਕਲਾਸ ਦੀ ਸੁਰੱਖਿਆ ਤਿਆਰੀ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ"
                : "Manage your class safety preparedness"}
          </p>
        </div>

        {/* Class Selector */}
        <div className="mb-6">
          <Label htmlFor="class-select">Select Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10-A">Class 10-A</SelectItem>
              <SelectItem value="10-B">Class 10-B</SelectItem>
              <SelectItem value="9-A">Class 9-A</SelectItem>
              <SelectItem value="9-B">Class 9-B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">{classStats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Students</p>
                  <p className="text-2xl font-bold text-green-900">{classStats.activeStudents}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-orange-900">{classStats.averageScore}%</p>
                </div>
                <Award className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Modules Done</p>
                  <p className="text-2xl font-bold text-purple-900">{classStats.completedModules}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Upcoming Drills</p>
                  <p className="text-2xl font-bold text-red-900">{classStats.upcomingDrills}</p>
                </div>
                <Target className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Students</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Modules</span>
            </TabsTrigger>
            <TabsTrigger value="drills" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Drills</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Class Participation</CardTitle>
                    <CardDescription>Monitor student progress and engagement</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search students..." className="pl-8 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Preparedness Score</TableHead>
                      <TableHead>Modules Completed</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={student.preparednessScore} className="w-16" />
                            <span className="text-sm">{student.preparednessScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.modulesCompleted}/10</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.lastActive}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "default" : "secondary"}>
                            {student.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Learning Modules</CardTitle>
                    <CardDescription>Assign and manage learning modules for your class</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Module
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{module.title}</h4>
                          <Badge variant="outline">{module.category}</Badge>
                          <Badge variant="secondary">{module.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{module.duration}</span>
                          </span>
                          <span>Assigned: {module.assigned} students</span>
                          <span>Completed: {module.completed} students</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {Math.round((module.completed / module.assigned) * 100)}% Complete
                          </p>
                          <Progress value={(module.completed / module.assigned) * 100} className="w-24 mt-1" />
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Emergency Drills</CardTitle>
                    <CardDescription>Schedule and manage emergency drills for your class</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Drill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDrills.map((drill) => (
                  <div key={drill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{drill.title}</h4>
                          <Badge variant="outline">{drill.type}</Badge>
                          <Badge
                            variant={drill.status === "scheduled" ? "default" : "secondary"}
                            className={drill.status === "scheduled" ? "bg-blue-600" : ""}
                          >
                            {drill.status === "scheduled" ? "Scheduled" : "Completed"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{drill.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{drill.time}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{drill.participants} participants</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Start Drill
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Overview</CardTitle>
                  <CardDescription>Overall class preparedness metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Preparedness Score</span>
                      <span className="text-2xl font-bold text-primary">{classStats.averageScore}%</span>
                    </div>
                    <Progress value={classStats.averageScore} className="w-full" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{classStats.activeStudents}</p>
                        <p className="text-sm text-muted-foreground">Active Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{classStats.completedModules}</p>
                        <p className="text-sm text-muted-foreground">Modules Completed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest student activities and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Priya Patel completed Flood Safety module</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Rahul Singh missed Fire Safety drill</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Arjun Sharma earned Safety Champion badge</p>
                        <p className="text-xs text-muted-foreground">3 hours ago</p>
                      </div>
                    </div>
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
