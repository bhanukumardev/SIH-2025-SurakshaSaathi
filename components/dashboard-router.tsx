"use client"

import { useAuth } from "@/hooks/use-auth"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { ParentDashboard } from "@/components/dashboards/parent-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"

export function DashboardRouter() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "student":
      return <StudentDashboard />
    case "teacher":
      return <TeacherDashboard />
    case "parent":
      return <ParentDashboard />
    case "administrator":
      return <AdminDashboard />
    default:
      return <div>Invalid user role</div>
  }
}
