import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import BookReviewForm from '@/components/AddBookReviewForm'
import { Tab, TabButton, TabPanel } from '@/components/Tab'
import BookReviewList from '@/components/BookReviewList'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import { ChevronRight, MapPinPlus, Pencil } from 'lucide-react'
import Tooltip from '@/components/Tooltip.tsx'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { StarRating } from '@/components/StarRating'
import { useNavigate } from 'react-router-dom'
import Modal from '@/components/Modal'
import LoginPromptContent from '@/components/LoginPromptContent'
import toast from 'react-hot-toast'
import { addBookToCollection, fetchUserBooks, removeBookFromUser } from '@/api/collections'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`
}

type Props = {
  book: BookResponseDTO
  locations: BookLocationResponse[]
  reviews: ReviewWithUserDTO[]
  onClose: () => void
  onFlyTo: (lat: number, lng: number) => void
  onUpdate: () => void
  onAddLocationClick: () => void
  newMarkerPosition?: { lat: number; lng: number } | null
  onCancelAddLocation?: () => void
  onSaveAddLocation?: () => void
  onUpdateReviews: () => void
  onUpdateLocations: () => void
}

export default function HomeSidePanel({ 
  onUpdateReviews,
  newMarkerPosition, 
  onAddLocationClick, 
  book, 
  locations, 
  reviews, 
  onClose, 
  onFlyTo 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false)

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

  return (
    <div className="relative lg:w-[30%]">
      <div className="absolute top-2 right-2 z-10">
        <Tooltip message="Edit buku ini">
          <button
            onClick={handleEdit}
            className="p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition"
            aria-label="Edit buku"
          >
            <Pencil size={16} className="text-gray-600" />
          </button>
        </Tooltip>
      </div>
      
      <div className="z-[1000] absolute -left-5 top-1/2 -translate-y-1/2">
        <Tooltip message="Tutup panel samping">
          <button
            onClick={() => {
              onClose()
              setIsExpanded(false)
            }}
            className="bg-white text-gray-500 py-4 shadow rounded-l-lg"
          >
            <ChevronRight size={20} />
          </button>
        </Tooltip>
      </div>

      <div
        className="transition-all duration-500 transform translate-x-0 opacity-100 bg-white rounded p-4 shadow relative"
        style={{maxHeight: '85vh', overflowY: 'auto'}}
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

        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#1C2C4C]">{book.title}</h2>
          <Tooltip message={isSaved ? "Sudah disimpan" : "Simpan buku"}>
            <button
              onClick={isSaved ? handleRemoveFromCollection : handleAddToCollection}
              className="ml-2 p-2 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-100 transition"
              aria-label="Simpan buku"
            >
              {isSaved ? (
                <BookmarkSolid className="w-5 h-5 text-yellow-500 transition-colors"/>
              ) : (
                <BookmarkOutline className="w-5 h-5 text-gray-600 transition-colors"/>
              )}
            </button>
          </Tooltip>
        </div>

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

        <div className="mb-4">
          <p className="text-sm text-gray-700"><span className="font-medium">Genre:</span></p>
          <div className="flex flex-wrap mt-1 gap-1">
            {book.genres.map((genre) => (
              <span key={genre.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {genre.genreName}
              </span>
            ))}
          </div>
        </div>

        {!newMarkerPosition && (
          <div className="flex justify-center mb-6">
            <div className="block">
              <button
                onClick={onAddLocationClick}
                className="px-4 h-[42px] w-full bg-[#1E497C] font-semibold text-white rounded-full shadow-md flex items-center justify-center hover:bg-[#5C8BC1] transition-colors"
                aria-label="Tambah lokasi"
              >
                <MapPinPlus size={20}/>
                <span className="ml-2">Tambah lokasi</span>
              </button>
            </div>
          </div>
        )}

        <Tab defaultTab="locations">
          <TabButton id="locations">Lokasi</TabButton>
          <TabButton id="reviews">Ulasan</TabButton>

          <TabPanel id="locations">
            {locations.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-600">
                {locations.map((loc) => (
                  <li
                    key={loc.id}
                    className="border border-gray-200 rounded p-2 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => onFlyTo(loc.coordinates[0], loc.coordinates[1])}
                  >
                    <p className="font-semibold text-gray-800">{loc.locationName}</p>
                    <p className="text-gray-800">{formatDistance(loc.distanceMeters)}</p>
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
                <BookReviewForm bookId={book.id} onUpdateReviews={onUpdateReviews}/>
              </div>

              <div className="flex flex-col">
                {reviews.length > 0 && (
                  <>
                    <hr className="border-t border-gray-300 mb-4"/>
                    <BookReviewList reviews={reviews} bookId={book.id} onUpdateReviews={onUpdateReviews}/>
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
          <Modal hash="#location">
            <h2 className="text-xl font-semibold mb-4">Menambah lokasi</h2>
            <LoginPromptContent/>
          </Modal>
        </>
      )}
    </div>
  )
}