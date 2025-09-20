"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/lib/types"
import authService from "@/services/auth-service"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data and token on mount
    const storedUser = localStorage.getItem("kata-sweet-shop-user")
    const token = localStorage.getItem("token")
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    } else {
      // Clear any partial data
      localStorage.removeItem("kata-sweet-shop-user")
      localStorage.removeItem("token")
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.login({ email, password })
      
      const userData: User = {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date()
      }
      
      setUser(userData)
      localStorage.setItem("kata-sweet-shop-user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authService.register({
        username: name,
        email,
        password
      })
      
      const userData: User = {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date()
      }
      
      setUser(userData)
      localStorage.setItem("kata-sweet-shop-user", JSON.stringify(userData))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout() // This will remove the token and redirect
    setUser(null)
    localStorage.removeItem("kata-sweet-shop-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
