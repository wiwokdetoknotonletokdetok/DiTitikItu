import { useEffect, useRef, useState } from 'react'
import { getUserIPLocation } from '@/api/getUserIPLocation'
import { getRecommendationsBooks } from '@/api/getRecommendationsBooks'
import { getBooksId } from '@/api/getBooksId'
import { getBooksIdLocations } from '@/api/getBooksIdLocations'
import type { UserPosition } from '@/dto/UserPosition'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import { ApiError } from '@/exception/ApiError'
import ToContentButton from '@/components/ToContentButton'

import MapsView from '@/components/MapView'
import HomeSidePanel from '@/components/HomeSidePanel'
import HomeContent from '@/components/HomeContent'
import LiveSearch from '@/components/LiveSearch.tsx'
import Tooltip from '@/components/Tooltip.tsx'
import { BookPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/Navbar.tsx'

export default function Home() {
  const [userPosition, setUserPosition] = useState<UserPosition>()
  const [recommendations, setRecommendations] = useState<BookSummaryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BookResponseDTO | null>(null)
  const [selectedBookLocations, setSelectedBookLocations] = useState<BookLocationResponse[]>([])
  const [loadingBook, setLoadingBook] = useState(false)
  const [flyToLocation, setFlyToLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, { threshold: 0.1 })

    const target = contentRef.current
    if (target) observer.observe(target)
    return () => { if (target) observer.unobserve(target) }
  }, [])

  useEffect(() => {
    const fallbackToIPLocation = async () => {
      try {
        const res = await getUserIPLocation()
        setUserPosition({ latitude: res.data.latitude, longitude: res.data.longitude })
      } catch (err) {
        if (err instanceof ApiError) console.error('API error:', err.message)
        else console.error('Terjadi kesalahan.')
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => fallbackToIPLocation()
      )
    } else {
      fallbackToIPLocation()
    }
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await getRecommendationsBooks()
        setRecommendations(res.data)
      } catch (err) {
        console.error('Gagal mengambil data buku:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

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

  return (
    <div className="px-4 bg-[#FAFAFA] min-h-screen">
      {!isVisible && <ToContentButton onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })} />}
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div ref={mapContainerRef} className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className={`transition-all duration-500 ${selectedBook ? 'lg:w-[70%]' : 'lg:w-full'}`}>
            <MapsView
              userPosition={userPosition}
              bookLocations={selectedBookLocations}
              flyToLocation={flyToLocation}
            >
              <div className="absolute z-[1000] top-2.5 left-2.5 max-w-md w-full">
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <LiveSearch onSelectBook={handleSelectBook}/>
                  </div>
                  <Link to="/books/new">
                    <button
                      className="w-[46px] h-[46px] rounded-full text-gray-500 bg-white border border-gray-300 shadow-md flex items-center justify-center"
                      aria-label="Tambah buku"
                    >
                      <Tooltip message="Tambah buku baru">
                        <BookPlus size={20}/>
                      </Tooltip>
                    </button>
                  </Link>
                </div>
              </div>
            </MapsView>
          </div>

          {loadingBook ? (
            <p className="text-sm text-gray-500">Memuat detail buku...</p>
          ) : selectedBook && (
            <HomeSidePanel
              book={selectedBook}
              locations={selectedBookLocations}
              onClose={() => {
                setSelectedBook(null)
                setSelectedBookLocations([])
              }}
              onFlyTo={(lat, lng) => setFlyToLocation({latitude: lat, longitude: lng})}
            />
          )}
        </div>

        <HomeContent
          books={recommendations}
          loading={loading}
          onSelectBook={handleSelectBook}
          contentRef={contentRef}
        />
      </div>
    </div>
  )
}
