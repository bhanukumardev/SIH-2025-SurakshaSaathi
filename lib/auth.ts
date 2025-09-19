export type UserRole = "student" | "teacher" | "parent" | "administrator"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  school?: string
  class?: string
  region?: "national" | "punjab"
  language?: "en" | "hi" | "pa"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock authentication functions - in real app would connect to backend
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    email: "arjun@school.edu",
    role: "student",
    school: "Delhi Public School",
    class: "10th",
    region: "national",
    language: "en",
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya@school.edu",
    role: "teacher",
    school: "Delhi Public School",
    region: "national",
    language: "hi",
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    email: "rajesh@parent.com",
    role: "parent",
    region: "punjab",
    language: "pa",
  },
  {
    id: "4",
    name: "Dr. Sunita Patel",
    email: "sunita@admin.edu",
    role: "administrator",
    school: "Regional Education Board",
    region: "national",
    language: "en",
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app would validate against backend
  const user = mockUsers.find((u) => u.email === email)
  return user || null
}

export const getUserByRole = (role: UserRole): User[] => {
  return mockUsers.filter((user) => user.role === role)
}
