import { NextRequest, NextResponse } from 'next/server'

const mockUsers = [
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

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const user = mockUsers.find(u => u.email === email && password === 'demo123')

  if (user) {
    return NextResponse.json({ success: true, user })
  } else {
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  }
}
