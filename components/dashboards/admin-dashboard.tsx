"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Building2,
  Users,
  TrendingUp,
  Calendar,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  MapPin,
  Clock,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLocalization } from "@/hooks/use-localization"
import { DashboardHeader } from "@/components/dashboard-header"
import { TricolorStripe } from "@/components/cultural-elements"

export function AdminDashboard() {
  const { user } = useAuth()
  const { t, config } = useLocalization()
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  const overallStats = {
    totalSchools: 1247,
    activeSchools: 1156,
    totalStudents: 45678,
    totalTeachers: 3456,
    averagePreparedness: 78,
    completedDrills: 892,
    scheduledDrills: 156,
  }

  const schoolLeaderboard = [
    {
      id: 1,
      name: "Delhi Public School, Vasant Kunj",
      location: "Delhi",
      students: 1200,
      preparednessScore: 94,
      modulesCompleted: 98,
      drillsCompleted: 12,
      rank: 1,
      trend: "up",
    },
    {
      id: 2,
      name: "Kendriya Vidyalaya, Chandigarh",
      location: "Punjab",
      students: 980,
      preparednessScore: 91,
      modulesCompleted: 95,
      drillsCompleted: 11,
      rank: 2,
      trend: "up",
    },
    {
      id: 3,
      name: "DAV Public School, Mumbai",
      location: "Maharashtra",
      students: 1350,
      preparednessScore: 89,
      modulesCompleted: 92,
      drillsCompleted: 10,
      rank: 3,
      trend: "stable",
    },
    {
      id: 4,
      name: "St. Xavier's School, Kolkata",
      location: "West Bengal",
      students: 1100,
      preparednessScore: 87,
      modulesCompleted: 90,
      drillsCompleted: 9,
      rank: 4,
      trend: "down",
    },
    {
      id: 5,
      name: "Ryan International, Bangalore",
      location: "Karnataka",
      students: 1450,
      preparednessScore: 85,
      modulesCompleted: 88,
      drillsCompleted: 8,
      rank: 5,
      trend: "up",
    },
  ]

  const regionalData = [
    { region: "Delhi", schools: 156, preparedness: 82, students: 8900 },
    { region: "Punjab", schools: 134, preparedness: 79, students: 7650 },
    { region: "Maharashtra", schools: 189, preparedness: 81, students: 10200 },
    { region: "Karnataka", schools: 167, preparedness: 78, students: 9100 },
    { region: "West Bengal", schools: 145, preparedness: 76, students: 8300 },
    { region: "Tamil Nadu", schools: 178, preparedness: 80, students: 9800 },
  ]

  const monthlyProgress = [
    { month: "Jul", preparedness: 72, drills: 45, modules: 234 },
    { month: "Aug", preparedness: 74, drills: 52, modules: 267 },
    { month: "Sep", preparedness: 76, drills: 48, modules: 289 },
    { month: "Oct", preparedness: 78, drills: 61, modules: 312 },
    { month: "Nov", preparedness: 79, drills: 58, modules: 334 },
    { month: "Dec", preparedness: 81, drills: 67, modules: 356 },
  ]

  const drillTypes = [
    { name: "Fire Safety", value: 35, color: "#FF6B6B" },
    { name: "Earthquake", value: 28, color: "#4ECDC4" },
    { name: "Flood", value: 20, color: "#45B7D1" },
    { name: "Cyclone", value: 12, color: "#96CEB4" },
    { name: "Other", value: 5, color: "#FFEAA7" },
  ]

  const upcomingDrills = [
    {
      id: 1,
      school: "Delhi Public School, Vasant Kunj",
      type: "Fire Safety",
      date: "2024-01-15",
      time: "10:30 AM",
      participants: 1200,
      status: "scheduled",
    },
    {
      id: 2,
      school: "Kendriya Vidyalaya, Chandigarh",
      type: "Earthquake",
      date: "2024-01-16",
      time: "2:00 PM",
      participants: 980,
      status: "scheduled",
    },
    {
      id: 3,
      school: "DAV Public School, Mumbai",
      type: "Flood Safety",
      date: "2024-01-18",
      time: "11:00 AM",
      participants: 1350,
      status: "scheduled",
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Low Participation Alert",
      message: "3 schools in Punjab region showing decreased drill participation",
      time: "2 hours ago",
      priority: "high",
    },
    {
      id: 2,
      type: "info",
      title: "New Module Released",
      message: "Cyclone Safety module now available for all regions",
      time: "1 day ago",
      priority: "medium",
    },
    {
      id: 3,
      type: "success",
      title: "Milestone Achieved",
      message: "Overall preparedness score crossed 80% mark",
      time: "2 days ago",
      priority: "low",
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
              ? "राष्ट्रीय आपदा तैयारी का अवलोकन और प्रबंधन"
              : config.language === "pa"
                ? "ਰਾਸ਼ਟਰੀ ਆਫ਼ਤ ਤਿਆਰੀ ਦਾ ਨਿਰੀਖਣ ਅਤੇ ਪ੍ਰਬੰਧਨ"
                : "National disaster preparedness overview and management"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="punjab">Punjab</SelectItem>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="karnataka">Karnataka</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Schools</p>
                  <p className="text-2xl font-bold text-blue-900">{overallStats.totalSchools.toLocaleString()}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Schools</p>
                  <p className="text-2xl font-bold text-green-900">{overallStats.activeSchools.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Students</p>
                  <p className="text-2xl font-bold text-purple-900">{overallStats.totalStudents.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Teachers</p>
                  <p className="text-2xl font-bold text-orange-900">{overallStats.totalTeachers.toLocaleString()}</p>
                </div>
                <BookOpen className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Avg. Preparedness</p>
                  <p className="text-2xl font-bold text-red-900">{overallStats.averagePreparedness}%</p>
                </div>
                <Target className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Completed Drills</p>
                  <p className="text-2xl font-bold text-yellow-900">{overallStats.completedDrills}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">Scheduled Drills</p>
                  <p className="text-2xl font-bold text-indigo-900">{overallStats.scheduledDrills}</p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="drills" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Drills</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Performance</CardTitle>
                  <CardDescription>Preparedness scores by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={regionalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="preparedness" fill="#FF9933" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Drill Distribution</CardTitle>
                  <CardDescription>Types of emergency drills conducted</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={drillTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {drillTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>School Leaderboard</CardTitle>
                    <CardDescription>Top performing schools based on preparedness metrics</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Metrics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Preparedness Score</TableHead>
                      <TableHead>Modules Completed</TableHead>
                      <TableHead>Drills Completed</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolLeaderboard.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={school.rank <= 3 ? "default" : "secondary"}
                              className={
                                school.rank === 1
                                  ? "bg-yellow-500"
                                  : school.rank === 2
                                    ? "bg-gray-400"
                                    : school.rank === 3
                                      ? "bg-orange-600"
                                      : ""
                              }
                            >
                              #{school.rank}
                            </Badge>
                            {school.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span>{school.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{school.students.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={school.preparednessScore} className="w-16" />
                            <span className="text-sm font-medium">{school.preparednessScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{school.modulesCompleted}%</TableCell>
                        <TableCell>{school.drillsCompleted}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              school.trend === "up" ? "default" : school.trend === "down" ? "destructive" : "secondary"
                            }
                            className={
                              school.trend === "up"
                                ? "bg-green-600"
                                : school.trend === "down"
                                  ? "bg-red-600"
                                  : "bg-gray-500"
                            }
                          >
                            {school.trend === "up" ? "↗" : school.trend === "down" ? "↘" : "→"} {school.trend}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drills" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Drill Management</CardTitle>
                    <CardDescription>Schedule and monitor emergency drills across institutions</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Drill
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDrills.map((drill) => (
                  <div key={drill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{drill.school}</h4>
                          <Badge variant="outline">{drill.type}</Badge>
                          <Badge variant="default" className="bg-blue-600">
                            {drill.status}
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
                            <span>{drill.participants.toLocaleString()} participants</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Monitor
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preparedness Trends</CardTitle>
                <CardDescription>Monthly progress across all institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="preparedness" stroke="#FF9933" strokeWidth={3} />
                    <Line type="monotone" dataKey="drills" stroke="#138808" strokeWidth={2} />
                    <Line type="monotone" dataKey="modules" stroke="#000080" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important notifications and system updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${
                      alert.priority === "high"
                        ? "border-red-200 bg-red-50"
                        : alert.priority === "medium"
                          ? "border-orange-200 bg-orange-50"
                          : alert.type === "success"
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge
                            variant={
                              alert.priority === "high"
                                ? "destructive"
                                : alert.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
