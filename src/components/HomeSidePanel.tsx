import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import BookReviewForm from '@/pages/books/AddBookReviewForm'
import { Tab, TabButton, TabPanel } from '@/components/Tab'
import BookReviewList from '@/pages/books/BookReviewList'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'

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
}

export default function HomeSidePanel({ book, locations, reviews, onClose, onFlyTo, onUpdate}: Props) {
  return (
    <div
      className="transition-all duration-500 lg:w-[30%] transform translate-x-0 opacity-100 bg-white rounded shadow p-4"
      style={{ maxHeight: '85vh', overflowY: 'auto' }}
    >
      <button onClick={onClose} className="mb-4 text-sm text-blue-600 hover:underline">
        Tutup
      </button>

      <img src={book.bookPicture} alt={book.title} className="w-full h-60 object-cover rounded mb-4" />

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
            <BookReviewForm bookId={book.id} onUpdate={onUpdate} />
          </div>
          <hr className="border-t border-gray-300" />
          <div className="flex flex-col">
            {reviews.length > 0 ? (
              <BookReviewList reviews={reviews} bookId={book.id} onUpdate={onUpdate} />
            ) : (
              <p className="text-sm text-center text-gray-500">
                Belum ada ulasan tersedia untuk buku ini.
              </p>
            )}
          </div>
        </TabPanel>
      </Tab>
    </div>
  )
}
