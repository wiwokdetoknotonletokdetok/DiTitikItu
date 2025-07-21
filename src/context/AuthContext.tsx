import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { UserPrincipal } from '@/dto/UserPrincipal'
import type { UserProfileResponse } from '@/dto/UserProfileResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { getUserProfile } from '@/api/getUserProfile'

const encodeKey = (key: string) => btoa(key)
const decodeKey = (key: string) => atob(key)

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
      const encodedToken = localStorage.getItem(encodeKey('token'))
      const encodedId = localStorage.getItem(encodeKey('id'))
      const encodedName = localStorage.getItem(encodeKey('name'))
      const encodedProfilePicture = localStorage.getItem(encodeKey('profilePicture'))

      if (!encodedToken || !encodedId || !encodedName || !encodedProfilePicture) {
        setIsLoading(false)
        logout()
        return
      }

      try {
        const token = decodeKey(encodedToken)
        const id = decodeKey(encodedId)
        const name = decodeKey(encodedName)
        const profilePicture = decodeKey(encodedProfilePicture)

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

      localStorage.setItem(encodeKey('token'), encodeKey(token))
      localStorage.setItem(encodeKey('id'), encodeKey(payload.sub))
      localStorage.setItem(encodeKey('name'), encodeKey(profile.data.name))
      localStorage.setItem(encodeKey('profilePicture'), encodeKey(profile.data.profilePicture))

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
    localStorage.removeItem(encodeKey('token'))
    localStorage.removeItem(encodeKey('id'))
    localStorage.removeItem(encodeKey('name'))
    localStorage.removeItem(encodeKey('profilePicture'))
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
