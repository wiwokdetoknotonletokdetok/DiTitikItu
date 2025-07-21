import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import BookReviewForm from '@/pages/books/AddBookReviewForm'
import { Tab, TabButton, TabPanel } from '@/components/Tab'
import BookReviewList from '@/pages/books/BookReviewList'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import { ChevronRight } from 'lucide-react'
import Tooltip from '@/components/Tooltip.tsx'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

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
  newMarkerPosition?: { lat: number; lng: number }
  onCancelAddLocation?: () => void
  onSaveAddLocation?: () => void
  onUpdateReviews: () => void
}

export default function HomeSidePanel({ onUpdateReviews, onSaveAddLocation, onCancelAddLocation, newMarkerPosition, onAddLocationClick, book, locations, reviews, onClose, onFlyTo }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const existingReview = reviews.find((r) => r.userId === user?.id)

  return (
    <div className="relative lg:w-[30%]">
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
        className="transition-all duration-500 transform translate-x-0 opacity-100 bg-white rounded p-4 shadow"
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

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 pointer-events-none"/>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
            <span className="text-white text-sm font-medium">
              {isExpanded ? 'Klik untuk perkecil' : 'Klik untuk perbesar'}
            </span>
          </div>
        </div>


        <h2 className="text-xl font-bold text-[#1C2C4C] mb-2">{book.title}</h2>

        <div className="text-sm text-gray-700 mb-4">
          <p><span className="font-medium">Penulis:</span> {book.authorNames.join(', ')}</p>
          <p><span className="font-medium">Penerbit:</span> {book.publisherName}</p>
          <p><span className="font-medium">Tahun Terbit:</span> {book.publishedYear}</p>
          <p><span className="font-medium">Bahasa:</span> {book.language}</p>
          <p><span className="font-medium">Halaman:</span> {book.totalPages}</p>
          <p><span className="font-medium">Rating:</span> {book.totalRatings} ⭐</p>
        </div>

        <div className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">
          {book.synopsis}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700"><span className="font-medium">Genre:</span></p>
          <div className="flex flex-wrap mt-1 gap-1">
            {book.genreNames.map((genre) => (
              <span key={genre} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {genre}
            </span>
            ))}
          </div>
        </div>

        <Tab defaultTab="locations">
          <TabButton id="locations">Lokasi</TabButton>
          <TabButton id="reviews">Ulasan</TabButton>

          <TabPanel id="locations">
            {!newMarkerPosition ? (
              <div className="mb-3">
                <button
                  onClick={onAddLocationClick}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  + Tambah Lokasi
                </button>
              </div>
            ) : (
              <div className="mb-3 space-y-2">
                <button
                  onClick={() => {
                    onSaveAddLocation?.()
                  }}
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 transition w-full"
                >
                  Simpan Lokasi
                </button>
                <button
                  onClick={() => {
                    onCancelAddLocation?.()
                  }}
                  className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-300 transition w-full"
                >
                  Batal
                </button>
              </div>
            )}
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
            <div className="mb-4">
              {isLoggedIn() && !existingReview && (
                <BookReviewForm bookId={book.id} onUpdateReviews={onUpdateReviews} />
              )}
            </div>
            <hr className="border-t border-gray-300" />
            <div className="flex flex-col">
              {reviews.length > 0 ? (
                <BookReviewList reviews={reviews} bookId={book.id} onUpdateReviews={onUpdateReviews} />
              ) : (
                <p className="text-sm text-center text-gray-500">
                  Belum ada ulasan tersedia untuk buku ini.
                </p>
              )}
            </div>
          </TabPanel>
        </Tab>
      </div>
    </div>
  )
}
