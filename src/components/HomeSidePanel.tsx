import BookReviewForm from '@/components/AddBookReviewForm'
import { Tab, TabButton, TabPanel } from '@/components/Tab'
import BookReviewList from '@/components/BookReviewList'
import { ChevronRight, MapPinPlus, Pencil } from 'lucide-react'
import Tooltip from '@/components/Tooltip.tsx'
import { type RefObject, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { StarRating } from '@/components/StarRating'
import { useNavigate } from 'react-router-dom'
import Modal from '@/components/Modal'
import LoginPromptContent from '@/components/LoginPromptContent'
import toast from 'react-hot-toast'
import { addBookToCollection, fetchUserBooks, removeBookFromUser } from '@/api/collections'
import { BookmarkIcon as BookmarkSolid, MapPinIcon } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { resetSelectedBook } from '@/store/actions/selectedBookActions.ts'
import { resetSelectedBookLocations } from '@/store/actions/selectedBookLocationsActions.ts'
import { setNewMarkerPosition } from '@/store/actions/newMarkerPositionActions.ts'
import { setFlyToLocation } from '@/store/actions/flyToLocationActions.ts'
import ActionButton from '@/components/ActionButton.tsx'

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`
}

type Props = {
  isLoading: boolean
  handleFlyTo: () => void
  mapRef: RefObject<HTMLDivElement | null>
  scrollTo: (ref: RefObject<HTMLDivElement | null>) => void
}

const selectSelectedBook = (state: RootState) => {
  const book = state.selectedBook
  if (!book) throw new Error('Buku tidak ditemukan di state')
  return book
}

export default function HomeSidePanel({
  mapRef,
  scrollTo,
  isLoading,
  handleFlyTo,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const book = useSelector(selectSelectedBook)
  const locations = useSelector((state: RootState) => state.selectedBookLocations)
  const reviews = useSelector((state: RootState) => state.selectedBookReviews)
  const newMarkerPosition = useSelector((state: RootState) => state.newMarkerPosition)
  const userPosition = useSelector((state: RootState) => state.userPosition)
  const { token, isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)

  useEffect(() => {
  const checkIfSaved = async () => {
      if (!isLoggedIn() || !user) return
      try {
        const books = await fetchUserBooks(user.id)
        const saved = books.some((b) => b.id === book.id)
        setIsSaved(saved)
      } catch (err) {
        console.error('Gagal memuat koleksi pengguna:', err)
      }
    }

    checkIfSaved()
  }, [book.id, isLoggedIn, user])

  useEffect(() => {
    if (!token || !isLoggedIn()) {
      setIsSaved(false)
      setHasUserReviewed(false)
    }
  }, [token])

  useEffect(() => {
    if (!isLoggedIn() || !user) return
      const reviewed = reviews.some((r) => r.userId === user.id)
      setHasUserReviewed(reviewed)
  }, [reviews, user, isLoggedIn])

  useEffect(() => {
    if (newMarkerPosition) {
      scrollTo(mapRef)
    }
  }, [newMarkerPosition])


  const handleEdit = () => {
    if (isLoggedIn()) {
      navigate(`/books/${book.id}`);
    } else {
      navigate('#edit');
    }
  };

  const handleAddToCollection = async () => {
    if (!isLoggedIn()) {
      navigate('#collection')
      return
    }

    try {
      await addBookToCollection(book.id)
      toast.success('Buku berhasil ditambahkan ke koleksi!')
      setIsSaved(true)
    } catch (error) {
      console.error(error)
      toast.error('Gagal menambahkan buku ke koleksi.')
    }
  }

  const handleRemoveFromCollection = async () => {
    if (!isLoggedIn()) {
      navigate('#collection')
      return
    }

    try {
      await removeBookFromUser(book.id)
      toast.success('Buku dihapus dari koleksi.')
      setIsSaved(false)
    } catch (error) {
      console.error(error)
      toast.error('Gagal menghapus buku dari koleksi.')
    }
  }

  if (isLoading) return <HomeSidePanelSkeleton />

  return (
    <div className="relative">
      <div className="z-[1000] absolute -left-5 top-1/2 -translate-y-1/2">
        <Tooltip message="Tutup panel samping">
          <button
            onClick={() => {
              dispatch(resetSelectedBook())
              dispatch(resetSelectedBookLocations())
              setIsExpanded(false)
              navigate('/')
            }}
            className="bg-white text-gray-500 py-4 shadow rounded-l-lg"
          >
            <ChevronRight size={20} />
          </button>
        </Tooltip>
      </div>

      <div
        className="transition-all duration-500 transform translate-x-0 opacity-100 bg-white rounded p-4 shadow relative h-[85vh] overflow-y-auto"
      >
        <div className="relative group w-full mb-4 rounded overflow-hidden">
          <img
            src={book.bookPicture}
            alt={book.title}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              w-full object-cover cursor-pointer
              transition-all duration-500 ease-in-out
              ${isExpanded ? 'max-h-[1000px]' : 'max-h-[240px]'}
            `}
          />

          <div
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 pointer-events-none"/>

          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
            <span className="text-white text-sm font-medium">
              {isExpanded ? 'Klik untuk perkecil' : 'Klik untuk perbesar'}
            </span>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold text-[#1C2C4C]">{book.title}</h2>

        <div className="flex justify-evenly mb-6">
          <ActionButton
            icon={<MapPinPlus className="text-white" size={20}/>}
            disabled={!!newMarkerPosition}
            onClick={() => {
              if (!isLoggedIn()) {
                navigate('#locations')
              } else {
                dispatch(setNewMarkerPosition({latitude: userPosition.latitude, longitude: userPosition.longitude}))
                dispatch(setFlyToLocation({
                  latitude: userPosition.latitude,
                  longitude: userPosition.longitude,
                  zoom: userPosition.zoom
                }))
                handleFlyTo()
              }
            }}
            label="Tambah lokasi"
            className="bg-[#1E497C] hover:bg-[#5C8BC1] disabled:bg-[#5C8BC1]"
            tooltip="Tambah lokasi buku ini"
          />
          <ActionButton
            icon={isSaved ? (
              <BookmarkSolid className="w-5 h-5 text-yellow-500 transition-colors"/>
            ) : (
              <BookmarkOutline className="w-5 h-5 text-gray-500 transition-colors [stroke-width:2]"/>
            )}
            onClick={isSaved ? handleRemoveFromCollection : handleAddToCollection}
            label="Simpan"
            className="bg-white hover:bg-gray-100 border border-gray-200"
            tooltip={isSaved ? 'Buku ini sudah tersimpan di koleksi' : 'Simpan buku ke koleksi'}
          />
          <ActionButton
            icon={<Pencil className="text-gray-500" size={20}/>}
            onClick={handleEdit}
            label="Edit"
            className="bg-white hover:bg-gray-100 border border-gray-200"
            tooltip="Edit buku ini"
          />
        </div>

        <Tab defaultTab="locations">
          <TabButton id="locations">Lokasi</TabButton>
          <TabButton id="detail">Rincian</TabButton>
          <TabButton id="reviews">Ulasan</TabButton>

          <TabPanel id="detail">
            <div className="text-sm text-gray-700 mb-4">
              <p><span className="font-medium">Penulis:</span> {book.authorNames.join(', ')}</p>
              <p><span className="font-medium">Penerbit:</span> {book.publisherName}</p>
              <p><span className="font-medium">Tahun Terbit:</span> {book.publishedYear}</p>
              <p><span className="font-medium">Bahasa:</span> {book.language}</p>
              <p><span className="font-medium">Halaman:</span> {book.totalPages}</p>
            </div>

            <div className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">
              {book.synopsis}
            </div>

            <div>
              <p className="text-sm text-gray-700"><span className="font-medium">Genre:</span></p>
              <div className="flex flex-wrap mt-1 gap-1">
                {book.genres.map((genre) => (
                  <span key={genre.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {genre.genreName}
              </span>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel id="locations">
            {locations.length > 0 ? (
              <ul className="text-sm text-gray-600">
                {locations.map((loc, index) => (
                  <li
                    key={loc.id}
                    className="rounded cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => {
                      dispatch(setFlyToLocation({
                        latitude: loc.coordinates[0],
                        longitude: loc.coordinates[1],
                        zoom: 18
                      }))
                      handleFlyTo()
                      scrollTo(mapRef)
                    }}
                  >
                    <div className="flex gap-4 items-center p-2">
                      <div className="bg-[#1E497C] p-1 rounded-full">
                        <MapPinIcon className="flex-shrink-0 text-white w-4 h-4"/>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 truncate">{loc.locationName}</p>
                        <p className="text-gray-800">{formatDistance(loc.distanceMeters)}</p>
                      </div>
                    </div>
                    {index !== locations.length - 1 && (
                      <div className="ml-12 border-t border-gray-200"/>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center text-gray-500">Belum ada lokasi tersedia untuk buku ini.</p>
            )}
          </TabPanel>

          <TabPanel id="reviews">
            <div>
              <div className="flex flex-col items-center mb-6">
                <p className="text-2xl font-bold text-gray-800">{book.totalRatings.toFixed(1)}</p>
                <StarRating rating={book.totalRatings} size={5}/>
                <p className="text-sm text-gray-500 mt-1">{book.totalReviews} ulasan</p>
              </div>

              <div className="mb-4">
                <BookReviewForm bookId={book.id} isDisabled={hasUserReviewed}/>
              </div>

              <div className="flex flex-col">
                {reviews.length > 0 && (
                  <>
                    <hr className="border-t border-gray-300 mb-4"/>
                    <BookReviewList reviews={reviews} bookId={book.id}/>
                  </>
                )}
              </div>
            </div>
          </TabPanel>
        </Tab>
      </div>
      {!isLoggedIn() && (
        <>
          <Modal hash="#edit">
            <h2 className="text-xl font-semibold mb-4">Edit buku</h2>
            <LoginPromptContent/>
          </Modal>
          <Modal hash="#collection">
            <h2 className="text-xl font-semibold mb-4">Simpan ke koleksi</h2>
            <LoginPromptContent/>
          </Modal>
          <Modal hash="#review">
            <h2 className="text-xl font-semibold mb-4">Menambah ulasan</h2>
            <LoginPromptContent/>
          </Modal>
        </>
      )}
    </div>
  )
}

function HomeSidePanelSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded p-4 shadow relative h-[85vh] overflow-y-auto">
      <div className="w-full h-[240px] bg-gray-200 rounded mb-4"/>

      <div className="flex items-center justify-between mb-2">
        <div className="h-5 bg-gray-200 rounded w-2/3"/>
        <div className="h-5 bg-gray-200 rounded w-8"/>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"/>
        <div className="h-4 bg-gray-200 rounded w-2/3"/>
        <div className="h-4 bg-gray-200 rounded w-1/3"/>
        <div className="h-4 bg-gray-200 rounded w-1/2"/>
        <div className="h-4 bg-gray-200 rounded w-1/4"/>
      </div>

      <div className="h-20 bg-gray-200 rounded mb-4"/>
    </div>
  )
}
