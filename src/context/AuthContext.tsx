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
  isLoading: boolean
}

interface JwtPayload {
  sub: string
  exp: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPrincipal | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('id')
      const name = localStorage.getItem('name')
      const profilePicture = localStorage.getItem('profilePicture')

      if (!token || !id || !name || !profilePicture) {
        setIsLoading(false)
        logout()
        return
      }

      try {
        const payload = jwtDecode<JwtPayload>(token)
        const currentTime = Math.floor(Date.now() / 1000)
        if (payload.exp && payload.exp < currentTime) {
          logout()
        } else {
          setUser({ id, name, profilePicture })
          setToken(token)
        }
      } catch (e) {
        logout()
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const login = async (token: string) => {
    try {
      const payload = jwtDecode<JwtPayload>(token)
      const profile: WebResponse<UserProfileResponse> = await getUserProfile(payload.sub)

      localStorage.setItem('token', token)
      localStorage.setItem('id', payload.sub)
      localStorage.setItem('name', profile.data.name)
      localStorage.setItem('profilePicture', profile.data.profilePicture)

      setUser({
        id: payload.sub,
        name: profile.data.name,
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
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    localStorage.removeItem('profilePicture')
    setUser(null)
    setToken(null)
  }

  function isLoggedIn(): boolean {
    return user !== null && token !== null
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
