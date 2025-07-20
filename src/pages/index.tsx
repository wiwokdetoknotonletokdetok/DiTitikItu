import { useEffect, useState } from 'react'
import MapView from '@/components/MapView'
import BookSearchBar from '@/components/SearchBar'
import {getUserIPLocation} from '@/api/getUserIPLocation.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LocationData } from '@/dto/LocationData.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { UserPosition } from '@/dto/UserPosition.ts'

export default function Home() {
  const [userPosition, setUserPosition] = useState<UserPosition>()

  useEffect(() => {
    const fallbackToIPLocation = async () => {
      try {
        const response: WebResponse<LocationData> = await getUserIPLocation()
        setUserPosition({
          latitude: response.data.latitude,
          longitude: response.data.longitude
        })
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('API error:', err.message)
        } else {
          console.error('Terjadi kesalahan. Silakan coba lagi.')
        }
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          setUserPosition({
            latitude: lat,
            longitude: lon
          })
        },
        () => {
          fallbackToIPLocation()
        }
      )
    } else {
      fallbackToIPLocation()
    }
  }, [])

  return (
    <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1C2C4C]">📚 Daftar Buku</h1>
          <a href="/books/new" className="text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] px-4 py-2 rounded-md shadow-sm transition" >
            + Tambah Buku Baru
          </a>
        </div>

        <div className="mb-6">
          <BookSearchBar onSearch={() => {}} />
        </div>

        <div className="mb-6">
          <MapView userPosition={userPosition} books={[]}/>
        </div>
      </div>
    </div>
  )
}
