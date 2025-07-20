import { useEffect, useRef, useState } from 'react'
import { getUserIPLocation } from '@/api/getUserIPLocation'
import { getBooksId } from '@/api/getBooksId'
import {booksIdLocations, postBooksIdLocations} from '@/api/booksIdLocations.ts'
import { fetchReviewsWithUser } from '@/api/reviewsWithUser'

import type { UserPosition } from '@/dto/UserPosition'
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
import {Link, useNavigate} from 'react-router-dom'
import Navbar from '@/components/Navbar.tsx'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import Modal from "@/components/Modal.tsx";
import TextInput from "@/components/TextInput.tsx";
import SubmitButton from "@/components/SubmitButton.tsx";

export default function Home() {
  const [userPosition, setUserPosition] = useState<UserPosition>()
  const navigate = useNavigate()
  const [selectedBook, setSelectedBook] = useState<BookResponseDTO | null>(null)
  const [selectedBookLocations, setSelectedBookLocations] = useState<BookLocationResponse[]>([])
  const [loadingBook, setLoadingBook] = useState(false)
  const [flyToLocation, setFlyToLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [reviews, setReviews] = useState<ReviewWithUserDTO[]>([])
  const topRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [newMarkerPosition, setNewMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState('')

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

  const handleSelectBook = async (bookId: string) => {
    setLoadingBook(true)
    try {
      const bookDetail = await getBooksId(bookId)
      setSelectedBook(bookDetail.data)

      if (userPosition) {
        const locationRes = await booksIdLocations(bookId, userPosition.latitude, userPosition.longitude)
        setSelectedBookLocations(locationRes.data)
      }

      await refreshBookAndReviews(bookId)
      topRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.error('Gagal mengambil detail/lokasi buku:', err)
    } finally {
      setLoadingBook(false)
    }
  }

  const refreshBookAndReviews = async (bookId: string) => {
    try {
      const [bookDetail, reviewDataWithUser] = await Promise.all([
        getBooksId(bookId),
        fetchReviewsWithUser(bookId),
      ])
      setSelectedBook(bookDetail.data)
      setReviews(reviewDataWithUser)
    } catch (err) {
      console.error('Gagal fetch data:', err)
    }
  }

  async function handleNewLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      await postBooksIdLocations(selectedBook?.id, {
        locationName: locationName,
        latitude: newMarkerPosition?.lat,
        longitude: newMarkerPosition?.lng
      })
      navigate(-1)
      setLocationName('')
      setNewMarkerPosition(null)
    } catch (err) {
      setLocationName('')
      setNewMarkerPosition(null)
      if (err instanceof ApiError && err.statusCode === 401) {
        console.log(err.message)
      } else {
        console.log('Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  }

  return (
    <div ref={topRef} className="px-4 bg-[#FAFAFA] min-h-screen">
      {!isVisible && <ToContentButton onClick={() => contentRef.current?.scrollIntoView({ behavior: 'smooth' })} />}
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className={`transition-all duration-500 ${selectedBook ? 'lg:w-[70%]' : 'lg:w-full'}`}>
            <MapsView
              selectedBook={selectedBook}
              userPosition={userPosition}
              bookLocations={selectedBookLocations}
              flyToLocation={flyToLocation}
              newMarkerPosition={newMarkerPosition}
              onUpdateNewMarkerPosition={(pos) => setNewMarkerPosition(pos)}
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
              reviews={reviews}
              onClose={() => {
                setSelectedBook(null)
                setSelectedBookLocations([])
              }}
              onAddLocationClick={() => {
                if (userPosition) {
                  setNewMarkerPosition({ lat: userPosition.latitude, lng: userPosition.longitude })
                  setFlyToLocation({ latitude: userPosition.latitude, longitude: userPosition.longitude })
                }
              }}
              newMarkerPosition={newMarkerPosition}
              onCancelAddLocation={() => {
                setNewMarkerPosition(null)
                setLocationName('')
              }}
              onSaveAddLocation={() => navigate('#locations')}
              onFlyTo={(lat, lng) => setFlyToLocation({ latitude: lat, longitude: lng })}
              onUpdate={() => refreshBookAndReviews(selectedBook.id)}
            />
          )}
        </div>

        <HomeContent
          onSelectBook={handleSelectBook}
          contentRef={contentRef}
        />
        <Modal hash="#locations">
          <form onSubmit={handleNewLocation}>
            <TextInput
              label="Nama lokasi"
              name="location"
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value)
              }}
              placeholder="Masukkann nama lokasi"
            />
            <SubmitButton type="submit">
              Simpan
            </SubmitButton>
          </form>
        </Modal>
      </div>
    </div>
  )
}
