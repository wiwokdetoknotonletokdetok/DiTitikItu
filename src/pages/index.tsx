import { useEffect, useRef, useState } from 'react'
import MapView from '@/components/MapView'
import BookSearchBar from '@/components/SearchBar'
import {getUserIPLocation} from '@/api/getUserIPLocation.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import type { LocationData } from '@/dto/LocationData.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { UserPosition } from '@/dto/UserPosition.ts'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO.ts'
import BookCard from '@/components/BookCard.tsx'
import { getRecommendationsBooks } from '@/api/getRecommendationsBooks.ts'
import type { BookResponseDTO } from '@/dto/BookResponseDTO.ts'
import { getBooksId } from '@/api/getBooksId.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import { getBooksIdLocations } from '@/api/getBooksIdLocations.ts'

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export default function Home() {
  const [userPosition, setUserPosition] = useState<UserPosition>()
  const [recommendations, setRecommendations] = useState<BookSummaryDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookResponseDTO | null>(null)
  const [selectedBookLocations, setSelectedBookLocations] = useState<BookLocationResponse[]>([])
  const [loadingBook, setLoadingBook] = useState(false)
  const [flyToLocation, setFlyToLocation] = useState<{ latitude: number; longitude: number } | null>(null)


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

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const response = await getRecommendationsBooks()
        setRecommendations(response.data)
      } catch (err) {
        console.error('Error fetching books:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    if (selectedBook && mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedBook])

  const handleSelectBook = async (bookId: string) => {
    setLoadingBook(true)
    try {
      const bookDetail = await getBooksId(bookId)
      setSelectedBook(bookDetail.data)

      if (userPosition) {
        const locationRes = await getBooksIdLocations(bookId, userPosition.latitude, userPosition.longitude)
        setSelectedBookLocations(locationRes.data)
      }

      mapContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.error('Gagal mengambil detail/lokasi buku:', err)
    } finally {
      setLoadingBook(false)
    }
  }

  useEffect(() => {
    if (flyToLocation) {
      const timeout = setTimeout(() => setFlyToLocation(null), 2000)
      return () => clearTimeout(timeout)
    }
  }, [flyToLocation])

  return (
    <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1C2C4C]">📚 Daftar Buku</h1>
          <a href="/books/new"
             className="text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] px-4 py-2 rounded-md shadow-sm transition">
            + Tambah Buku Baru
          </a>
        </div>

        <div className="mb-6" ref={mapContainerRef}>
          <BookSearchBar onSearch={() => {
          }}/>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div
            className={`transition-all duration-500 ${
              selectedBook ? 'lg:w-[70%]' : 'lg:w-full'
            }`}
          >
            <MapView
              userPosition={userPosition}
              bookLocations={selectedBookLocations}
              flyToLocation={flyToLocation}
            />
          </div>

          {loadingBook ? (
            <p className="text-sm text-gray-500">Memuat detail buku...</p>
          ) : selectedBook && (
            <div
              className="transition-all duration-500 lg:w-[30%] transform translate-x-0 opacity-100 bg-white rounded shadow p-4"
              style={{ maxHeight: '85vh', overflowY: 'auto' }}
            >
              <img
                src={selectedBook.bookPicture}
                alt={selectedBook.title}
                className="w-full h-60 object-cover rounded mb-4"
              />

              <h2 className="text-xl font-bold text-[#1C2C4C] mb-2">{selectedBook.title}</h2>

              <div className="text-sm text-gray-700 mb-4">
                <p><span className="font-medium">Penulis:</span> {selectedBook.authorNames.join(', ')}</p>
                <p><span className="font-medium">Penerbit:</span> {selectedBook.publisherName}</p>
                <p><span className="font-medium">Tahun Terbit:</span> {selectedBook.publishedYear}</p>
                <p><span className="font-medium">Bahasa:</span> {selectedBook.language}</p>
                <p><span className="font-medium">Halaman:</span> {selectedBook.totalPages}</p>
                <p><span className="font-medium">Rating:</span> {selectedBook.totalRatings} ⭐</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {selectedBook.synopsis}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700"><span className="font-medium">Genre:</span></p>
                <div className="flex flex-wrap mt-1 gap-1">
                  {selectedBook.genreNames.map((genre) => (
                    <span
                      key={genre}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {selectedBookLocations.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">Lokasi Buku:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {selectedBookLocations.map((location) => (
                      <li
                        key={location.id}
                        className="border border-gray-200 rounded p-2"
                        onClick={() => setFlyToLocation({
                          latitude: location.coordinates[0], longitude: location.coordinates[1]
                        })}
                      >
                        <p className="font-semibold text-gray-800">{location.locationName}</p>
                        <p className="text-gray-800">{formatDistance(location.distanceMeters)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedBook(null)
                  setSelectedBookLocations([])
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Tutup
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            recommendations.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => handleSelectBook(book.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
