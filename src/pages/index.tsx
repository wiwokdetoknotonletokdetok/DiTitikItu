import { type RefObject, useEffect, useRef, useState } from 'react'
import { getUserIPLocation } from '@/api/getUserIPLocation'
import { getBooksId } from '@/api/getBooksId'
import { booksIdLocations } from '@/api/booksIdLocations.ts'
import { fetchReviewsWithUser } from '@/api/reviewsWithUser'
import { ApiError } from '@/exception/ApiError'
import ToContentButton from '@/components/ToContentButton'
import MapsView from '@/components/MapView'
import HomeSidePanel from '@/components/HomeSidePanel'
import HomeContent from '@/components/HomeContent'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '@/components/Navbar.tsx'
import Modal from '@/components/Modal.tsx'
import BookToolbar from '@/components/BookToolbar.tsx'
import LocateMeButton from '@/components/LocateMeButton.tsx'
import { fetchBookLocations } from '@/api/bookLocation.ts'
import LocationForm from '@/components/LocationForm.tsx'
import { Check, X } from 'lucide-react'
import Tooltip from '@/components/Tooltip.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import LoginPromptContent from '@/components/LoginPromptContent'
import { useDispatch, useSelector } from 'react-redux'
import { setUserPosition } from '@/store/actions/userPositionActions.ts'
import { setSelectedBook } from '@/store/actions/selectedBookActions.ts'
import type { RootState } from '@/store'
import { setSelectedBookLocations } from '@/store/actions/selectedBookLocationsActions.ts'
import { setSelectedBookReviews } from '@/store/actions/selectedBookReviewsActions.ts'
import { resetNewMarkerPosition } from '@/store/actions/newMarkerPositionActions.ts'
import { setFlyToLocation } from '@/store/actions/flyToLocationActions.ts'
import OnboardingTour from '@/components/OnboardingTour.tsx'

export const ONBOARDING_VERSION = 'v1'

export default function Home() {
  const [onboardingStep, setOnboardingStep] = useState(() => {
    const hasSeen = localStorage.getItem('onboardingVersion')
    return hasSeen === ONBOARDING_VERSION ? -1 : 0
  })

  const { id: bookId } = useParams<{ id: string }>()
  const { isLoggedIn, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loadingBook, setLoadingBook] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sidePanelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const locateMeRef = useRef<HTMLButtonElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const addBookRef = useRef<HTMLButtonElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [locationName, setLocationName] = useState('')
  const [flyTrigger, setFlyTrigger] = useState(false)
  const dispatch = useDispatch()
  const userPosition = useSelector((state: RootState) => state.userPosition)
  const selectedBook = useSelector((state: RootState) => state.selectedBook)
  const newMarkerPosition = useSelector((state: RootState)=> state.newMarkerPosition)

  useEffect(() => {
    if (isLoggedIn() && !token) return
    scrollTo(sidePanelRef)
    if (bookId && (!selectedBook || bookId !== selectedBook.id)) {
      handleSelectBook(bookId)
    }
  }, [bookId, token, location.state])

  function handleFlyTo() {
    setFlyTrigger(!flyTrigger)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting)
    }, { threshold: 0.1 })

    const target = contentRef.current
    if (target) observer.observe(target)
    return () => { if (target) observer.unobserve(target) }
  }, [])

  const fallbackToIPLocation = async () => {
    try {
      const res = await getUserIPLocation()
      dispatch(setUserPosition({latitude: res.data.latitude, longitude: res.data.longitude, gps: false, zoom: 12}))
    } catch (err) {
      if (err instanceof ApiError) console.error('API error:', err.message)
      else console.error('Terjadi kesalahan.')
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => dispatch(setUserPosition({latitude: pos.coords.latitude, longitude: pos.coords.longitude, gps: true, zoom: 18})),
        () => fallbackToIPLocation()
      )
    } else {
      fallbackToIPLocation()
    }
  }, [])

  const handleSelectBook = async (bookId: string) => {
    setLoadingBook(true)
    try {
      const bookDetail = await getBooksId(bookId, token)
      dispatch(setSelectedBook(bookDetail.data))

      if (userPosition.longitude && userPosition.longitude) {
        const locationRes = await booksIdLocations(bookId, userPosition.latitude, userPosition.longitude)
        dispatch(setSelectedBookLocations(locationRes.data))
        if (locationRes.data.length > 0) {
          const nearestBook = locationRes.data[0]
          dispatch(setFlyToLocation({
            latitude: nearestBook.coordinates[0],
            longitude: nearestBook.coordinates[1],
            zoom: 18
          }))
          handleFlyTo()
        }
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
      dispatch(setSelectedBook(bookDetail.data))
      dispatch(setSelectedBookReviews(reviewDataWithUser))
    } catch (err) {
      console.error('Gagal fetch data:', err)
    }
  }

  const refreshLocations = async (bookId: string) => {
    if (!userPosition) return
    const data = await fetchBookLocations(bookId, userPosition.latitude, userPosition.longitude)
    dispatch(setSelectedBookLocations(data))
  }

  useEffect(() => {
    if (selectedBook?.id) {
      refreshLocations(selectedBook.id)
    }
  }, [selectedBook?.id])

  function scrollTo<T extends HTMLElement>(ref: RefObject<T | null>) {
    if (ref.current) {
      const offset = 68
      const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  function scrollToIfNotPassed(
    ref: RefObject<HTMLElement | null>,
    fallbackRef: RefObject<HTMLElement | null>
  ) {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    if (rect.top > 69 && fallbackRef.current) {
      scrollTo(ref)
    } else {
      scrollTo(fallbackRef)
    }
  }

  return (
    <>
      <OnboardingTour
        step={onboardingStep}
        setStep={setOnboardingStep}
        locateMeRef={locateMeRef}
        addBookRef={addBookRef}
        searchBarRef={searchBarRef}
      />

      {!isVisible && (
        <ToContentButton
          onClick={() => scrollToIfNotPassed(sidePanelRef, contentRef)}
        />
      )}
      <Navbar />

      <div ref={mapRef} className={`mb-6 flex flex-col lg:flex-row ${selectedBook ? 'gap-4' : 'gap-0'}`}>
        <div className={`transition-all duration-500 ${selectedBook ? 'lg:w-[70%]' : 'lg:w-full'}`}>
          <MapsView
            flyToTrigger={flyTrigger}
            onRefreshLocations={() => {
              if (selectedBook?.id) {
                refreshLocations(selectedBook.id)
              }
            }}
          >
            <>
              <BookToolbar
                addBookRef={addBookRef}
                searchBarRef={searchBarRef}
              />
              <LocateMeButton
                ref={locateMeRef}
                onClick={() => {
                  dispatch(setFlyToLocation({
                    latitude: userPosition.latitude,
                    longitude: userPosition.longitude,
                    zoom: userPosition.zoom
                  }))
                  handleFlyTo()
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
                          dispatch(resetNewMarkerPosition())
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

        <div
          ref={sidePanelRef}
          className={`${selectedBook ? 'lg:w-[30%]' : ''}`}
        >
          {selectedBook && (
            <HomeSidePanel
              isLoading={loadingBook}
              handleFlyTo={handleFlyTo}
              scrollTo={scrollTo}
              mapRef={mapRef}
            />
          )}
        </div>
      </div>

      <div className="mb-6">
        <HomeContent
          contentRef={contentRef}
        />
      </div>
      <Modal hash="#locations">
        {isLoggedIn() ? (
          <LocationForm
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
