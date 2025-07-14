import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchBookById } from '@/api/books'
import { fetchReviews } from '@/api/reviews'
import { fetchBookLocations } from '@/api/bookLocation'

import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { ReviewResponseDTO } from '@/dto/ReviewResponseDTO'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'

import BookReviewForm from './AddBookReviewForm'
import BookReviewList from './BookReviewList'
import AddBookLocationForm from './AddBookLocationForm'
import BookLocationList from './BookLocationList'

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<BookResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([])
  const [locations, setLocations] = useState<BookLocationResponse[]>([])
  
  const fetchLocations = async () => {
    const data = await fetchBookLocations(id!)
    setLocations(data)
  }

  const fetchData = async () => {
    if (!id) return
    try {
      const [bookData, reviewData] = await Promise.all([
        fetchBookById(id),
        fetchReviews(id)
      ])
      setBook(bookData)
      setReviews(reviewData)
      await fetchLocations()
    } catch (err) {
      console.error('Gagal fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  console.log('BookDetailPage loaded with book:', book)

  if (loading) return <p>Loading detail buku...</p>
  if (!book) return <p>Buku tidak ditemukan</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <img src={book.bookPicture} alt={book.title} className="w-64 h-96 object-cover rounded my-4" />
      <AddBookLocationForm bookId={id!} onSuccess={fetchLocations} />
      <BookLocationList locations={locations} />
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Penerbit:</strong> {book.publisherName}</p>
      <p><strong>Rating:</strong> {book.totalRatings}</p>
      <p><strong>Penulis:</strong> {book.authorNames.join(', ')}</p>
      <p><strong>Genre:</strong> {book.genreNames.join(', ')}</p>
      <p><strong>Sinopsis:</strong> {book.synopsis}</p>
      <p><strong>Jumlah Halaman:</strong> {book.totalPages}</p>
      <p><strong>Tahun Terbit:</strong> {book.publishedYear}</p>

      <BookReviewForm
        bookId={id!}
        onSuccess={async () => {
          const updated = await fetchReviews(id!)
          setReviews(updated)
        }}
      />

      <BookReviewList
        reviews={reviews}
        bookId={id!}
        onUpdate={() => fetchReviews(id!).then(setReviews)}
      />
    </div>
  )
}