import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { UserPrincipal } from '@/dto/UserPrincipal'
import type { UserProfileResponse } from '@/dto/UserProfileResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { getUserProfile } from '@/api/getUserProfile'

type AuthContextType = {
  user: UserPrincipal | null
  token: string | null
  login: (token: string) => Promise<void>
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
    const init = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const payload = jwtDecode<JwtPayload>(token)
        const currentTime = Math.floor(Date.now() / 1000)

        if (payload.exp && payload.exp < currentTime) {
          logout()
        } else {
          const profile: WebResponse<UserProfileResponse> = await getUserProfile(payload.sub)
          setUser({
            id: payload.sub,
            name: profile.data.name ,
            profilePicture: profile.data.profilePicture
          })
          setToken(token)
        }
      } catch (e) {
        logout()
      }
    }

    init()
  }, [])

  const login = async (token: string) => {
    try {
      const payload = jwtDecode<JwtPayload>(token)
      const profile: WebResponse<UserProfileResponse> = await getUserProfile(payload.sub)
      localStorage.setItem('token', token)
      setUser({
        id: payload.sub,
        name: profile.data.name ,
        profilePicture: profile.data.profilePicture
      })
      setToken(token)
    } catch (e) {
      console.error('Login gagal:', e)
      throw e
    }
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
