import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { UserPrincipal } from '@/dto/UserPrincipal'

type AuthContextType = {
  user: UserPrincipal | null
  token: string | null
  login: (token: string) => void
  logout: () => void
  isLoggedIn: () => boolean
}

interface JwtPayload {
  sub: string
  exp: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPrincipal | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = jwtDecode<JwtPayload>(token)
      const currentTime = Math.floor(Date.now() / 1000)

      if (payload.exp && payload.exp < currentTime) {
        logout()
      } else {
        setUser({ id: payload.sub })
        setToken(token)
      }
    }
  }, [])

  const login = (token: string) => {
    const payload = jwtDecode<JwtPayload>(token)
    localStorage.setItem('token', token)
    setUser({ id: payload.sub })
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  function isLoggedIn(): boolean {
    return user !== null
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
