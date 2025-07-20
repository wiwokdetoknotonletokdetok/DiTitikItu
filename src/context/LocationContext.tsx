import { createContext, useContext, useEffect, useState } from 'react'

export interface UserPosition {
  latitude: number
  longitude: number
}

const UserLocationContext = createContext<UserPosition | null>(null)

export function UserLocationProvider({ children }: { children: React.ReactNode }) {
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null)

  useEffect(() => {
    const fallbackToIPLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        setUserPosition({
          latitude: data.latitude,
          longitude: data.longitude
        })
      } catch (error) {
        console.error('Gagal mendapatkan lokasi IP:', error)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => fallbackToIPLocation()
      )
    } else {
      fallbackToIPLocation()
    }
  }, [])

  return (
    <UserLocationContext.Provider value={userPosition}>
      {children}
    </UserLocationContext.Provider>
  )
}

export function useUserLocation() {
  return useContext(UserLocationContext)
}
