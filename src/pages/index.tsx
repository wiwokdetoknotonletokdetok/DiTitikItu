import { useEffect, useRef, useState } from 'react'
import { getUserIPLocation } from '@/api/getUserIPLocation'
import { getBooksId } from '@/api/getBooksId'
import { booksIdLocations, postBooksIdLocations } from '@/api/booksIdLocations.ts'
import { fetchReviewsWithUser } from '@/api/reviewsWithUser'
import type { UserPosition } from '@/dto/UserPosition'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import { ApiError } from '@/exception/ApiError'
import ToContentButton from '@/components/ToContentButton'
import MapsView from '@/components/MapView'
import HomeSidePanel from '@/components/HomeSidePanel'
import HomeContent from '@/components/HomeContent'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '@/components/Navbar.tsx'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import Modal from '@/components/Modal.tsx'
import BookToolbar from '@/components/BookToolbar.tsx'
import LocateMeButton from '@/components/LocateMebutton.tsx'
import { fetchBookLocations } from '@/api/bookLocation.ts'
import LocationForm from '@/components/LocationForm.tsx'
import { Check, X } from 'lucide-react'
import Tooltip from '@/components/Tooltip.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import LoginPromptContent from '@/components/LoginPromptContent'

export default function Home() {
  const { id: bookId } = useParams<{ id: string }>()
  const { isLoggedIn, token } = useAuth()
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
  const [flyTrigger, setFlyTrigger] = useState(0)

  useEffect(() => {
    if (!token && isLoggedIn()) return
    if (bookId && (!selectedBook || selectedBook.id !== bookId)) {
      handleSelectBook(bookId)
    }
  }, [bookId, token])

  function handleFlyTo() {
    setFlyTrigger(prev => prev + 1)
  }

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
    if (window.location.pathname !== `/${bookId}`) {
      navigate(`/${bookId}`)
    }

    if (topRef.current) {
      const offset = 68
      const elementPosition = topRef.current.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }

    setLoadingBook(true)
    try {
      const bookDetail = await getBooksId(bookId, token)
      setSelectedBook(bookDetail.data)

      if (userPosition) {
        const locationRes = await booksIdLocations(bookId, userPosition.latitude, userPosition.longitude)
        setSelectedBookLocations(locationRes.data)
      }

      await refreshBookAndReviews(bookId)
    } catch (err) {
      console.error('Gagal mengambil detail/lokasi buku:', err)
    } finally {
      setLoadingBook(false)
    }
  }

  const refreshBookAndReviews = async (bookId: string) => {
    try {
      const [bookDetail, reviewDataWithUser] = await Promise.all([
        getBooksId(bookId, null),
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
      await postBooksIdLocations(selectedBook!.id, {
        locationName: locationName,
        latitude: newMarkerPosition!.lat,
        longitude: newMarkerPosition!.lng
      })
      navigate(-1)
      setLocationName('')
      await refreshLocations(selectedBook!.id)
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

  const refreshLocations = async (bookId: string) => {
    if (!userPosition) return
    const data = await fetchBookLocations(bookId, userPosition.latitude, userPosition.longitude)
    setSelectedBookLocations(data)
  }

  useEffect(() => {
    if (selectedBook?.id) {
      refreshLocations(selectedBook.id)
    }
  }, [selectedBook?.id])

  return (
    <>
      {!isVisible && (
        <ToContentButton
          onClick={() => {
            if (contentRef.current) {
              const offset = 68
              const elementPosition = contentRef.current.getBoundingClientRect().top + window.scrollY
              const offsetPosition = elementPosition - offset

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              })
            }
          }}
        />
      )}
      <Navbar />

      <div className={`mb-6 flex flex-col lg:flex-row ${selectedBook ? 'gap-4' : 'gap-0'}`}>
        <div className={`transition-all duration-500 ${selectedBook ? 'lg:w-[70%]' : 'lg:w-full'}`}>
          <MapsView
            selectedBook={selectedBook}
            userPosition={userPosition}
            bookLocations={selectedBookLocations}
            flyToLocation={flyToLocation}
            flyToTrigger={flyTrigger}
            newMarkerPosition={newMarkerPosition}
            onUpdateNewMarkerPosition={(pos) => setNewMarkerPosition(pos)}
            onRefreshLocations={() => {
              if (selectedBook?.id) {
                refreshLocations(selectedBook.id)
              }
            }}
          >
            <>
              <BookToolbar onSelectBook={handleSelectBook} />
              <LocateMeButton
                onClick={() => {
                  if (userPosition) {
                    setFlyToLocation({
                      latitude: userPosition.latitude,
                      longitude: userPosition.longitude
                    })
                    handleFlyTo()
                  }
                }}
              />
              {newMarkerPosition && (
                <div className="absolute z-[2001] top-2.5 right-2.5">
                  <div className="flex justify-between space-x-2">
                    <Tooltip message="Simpan lokasi">
                      <button
                        type="button"
                        onClick={() => navigate('#locations')}
                        className="w-[46px] h-[46px] rounded-full bg-[#1E497C] text-white hover:bg-[#5C8BC1] shadow-md flex items-center justify-center transition-colors"
                      >
                        <Check/>
                      </button>
                    </Tooltip>
                    <Tooltip message="Batalkan">
                      <button
                        onClick={() => {
                          setNewMarkerPosition(null)
                          setLocationName('')
                        }}
                        className="w-[46px] h-[46px] rounded-full text-gray-500 bg-white shadow-md flex items-center justify-center border border-gray-300 transition-colors"
                      >
                        <X />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </>
          </MapsView>
        </div>

        <div className={`${selectedBook ? 'lg:w-[30%]' : ''}`} ref={topRef}>
          {selectedBook && (
            <HomeSidePanel
              isLoading={loadingBook}
              book={selectedBook}
              locations={selectedBookLocations}
              reviews={reviews}
              onClose={() => {
                setSelectedBook(null)
                setSelectedBookLocations([])
                navigate('/')
              }}
              onAddLocationClick={() => {
                if (userPosition) {
                  setNewMarkerPosition({lat: userPosition.latitude, lng: userPosition.longitude})
                  setFlyToLocation({latitude: userPosition.latitude, longitude: userPosition.longitude})
                  handleFlyTo()
                }
              }}
              newMarkerPosition={newMarkerPosition}
              onCancelAddLocation={() => {
                setNewMarkerPosition(null)
                setLocationName('')
              }}
              onSaveAddLocation={() => navigate('#locations')}
              onFlyTo={(lat, lng) => {
                setFlyToLocation({ latitude: lat, longitude: lng })
                handleFlyTo()
              }}
              onUpdate={() => refreshBookAndReviews(selectedBook.id)}
              onUpdateReviews={() => refreshBookAndReviews(selectedBook.id)}
              onUpdateLocations={() => refreshLocations(selectedBook?.id)}
            />
          )}
        </div>
      </div>

      <div className="mb-6">
        <HomeContent
          onSelectBook={handleSelectBook}
          contentRef={contentRef}
        />
      </div>
      <Modal hash="#locations">
        {isLoggedIn() ? (
          <LocationForm
            onSubmit={handleNewLocation}
            locationName={locationName}
            setLocationName={setLocationName}
          />
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Menambah lokasi buku</h2>
            <LoginPromptContent />
          </>
        )}
      </Modal>
    </>
  )
}