'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from './localization'
import { useAuth } from './hooks'

interface RoleContextType {
  role: UserRole | null
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole | null>(null)

  useEffect(() => {
    if (user && user.role) {
      setRole(user.role as UserRole)
    } else {
      setRole(null)
    }
  }, [user])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}

// Protected Route Component
export function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: UserRole[] }) {
  const { role } = useRole()
  const router = useRouter()

  useEffect(() => {
    if (!role) {
      router.push('/login')
    } else if (!allowedRoles.includes(role)) {
      // Redirect to their own dashboard if unauthorized
      router.push('/dashboard')
    }
  }, [role, router, allowedRoles])

  if (!role || !allowedRoles.includes(role)) {
    return null
  }

  return <>{children}</>
}
