import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchBookById } from '@/api/books'
import { fetchBookLocations } from '@/api/bookLocation'
import { fetchReviewsWithUser } from '@/api/reviewsWithUser'

import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'

import BookReviewForm from './AddBookReviewForm'
import BookReviewList from './BookReviewList'
import AddBookLocationForm from './AddBookLocationForm'
import BookLocationList from './BookLocationList'
import { Plus } from 'lucide-react'

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<BookResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<ReviewWithUserDTO[]>([])
  const [locations, setLocations] = useState<BookLocationResponse[]>([])
  const [showAddLocation, setShowAddLocation] = useState(false)

  const fetchLocations = async () => {
    const data = await fetchBookLocations(id!)
    setLocations(data)
  }

  const fetchData = async () => {
    if (!id) return
    try {
      const [bookData, reviewDataWithUser] = await Promise.all([
        fetchBookById(id),
        fetchReviewsWithUser(id),
      ])
      setBook(bookData)
      setReviews(reviewDataWithUser)
      await fetchLocations()
    } catch (err) {
      console.error('Gagal fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookAndReviews = async () => {
    if (!id) return
    try {
      const [bookData, reviewDataWithUser] = await Promise.all([
        fetchBookById(id),
        fetchReviewsWithUser(id),
      ])
      setBook(bookData)
      setReviews(reviewDataWithUser)
    } catch (err) {
      console.error('Gagal fetch data:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) return <p className="p-6 text-gray-500">Loading detail buku...</p>
  if (!book) return <p className="p-6 text-red-500">Buku tidak ditemukan</p>

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img src={book.bookPicture} alt={book.title} 
        onError={(e) => { 
            e.currentTarget.onerror = null 
            e.currentTarget.src = 'https://placehold.co/300x450?text=Book'
          }} 
          className="w-full max-w-sm aspect-[2/3] object-cover rounded shadow" 
        />

        <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-[#1C2C4C]">{book.title}</h1>
              <button onClick={() => setShowAddLocation(true)} className="flex items-center px-4 py-2 text-lg font-bold">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#1E497C] hover:bg-[#5C8BC1]  mr-2">
                  <Plus className="h-5 w-5" color="white" />
                </span>
                Tambah Lokasi
              </button>
            </div>            
              <p><strong>📘 ISBN:</strong> {book.isbn}</p>
              <p><strong>🏢 Penerbit:</strong> {book.publisherName}</p>
              <p><strong>⭐ Rating:</strong> {book.totalRatings.toFixed(1)} / 5.0</p>
              <p><strong>✍️ Penulis:</strong> {book.authorNames.join(', ')}</p>
              <p><strong>🏷️ Genre:</strong> {book.genreNames.join(', ')}</p>
              <p><strong>📚 Halaman:</strong> {book.totalPages}</p>
              <p><strong>📅 Terbit:</strong> {book.publishedYear}</p>
          </div>
      </div>
      

      <div>
        <p className='text-xl font-semibold text-[#1C2C4C] mb-2'>📍 Lokasi:</p>
        <BookLocationList bookId={id!} onRefresh={fetchLocations} locations={locations} />
        {showAddLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
              <button
                onClick={() => setShowAddLocation(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-lg font-bold mb-4">Tambah Lokasi Buku</h2>
              <AddBookLocationForm
                bookId={id!}
                onSuccess={() => {
                  fetchLocations()
                  setShowAddLocation(false)
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1C2C4C] mb-2">📖 Sinopsis</h2>
        <p className="text-gray-800">{book.synopsis}</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-[#1C2C4C] mb-2 text-center">Rating Buku</h2>
        <p className="text-3xl text-yellow-600 mb-4 text-center">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index}>
              {index < book.totalRatings ? '★' : '☆'}
            </span>
          ))}
        </p>

        <h2 className="text-xl font-semibold text-[#1C2C4C] mb-2 text-left">Ulasan Pengguna</h2>
        <BookReviewForm bookId={id!} onSuccess={fetchBookAndReviews} />
        <BookReviewList reviews={reviews} bookId={id!} onUpdate={fetchBookAndReviews} />
      </div>
    </div>
  )
}
