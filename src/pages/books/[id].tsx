import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchBookById } from '@/api/books'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import { fetchReviews, postReview } from '@/api/reviews'
import type { ReviewResponseDTO } from '@/dto/ReviewResponseDTO'

export default function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState<BookResponseDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([])
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!id) return
    fetchBookById(id)
      .then(setBook)
      .catch(console.error)
      .finally(() => setLoading(false))
    
    fetchReviews(id)
      .then(setReviews)
      .catch(console.error)
  }, [id])

  if (loading) return <p>Loading detail buku...</p>
  if (!book) return <p>Buku tidak ditemukan</p>
  
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    try {
      await postReview(id, { message, rating })
      setMessage('')
      setRating(0)
      const updatedReviews = await fetchReviews(id)
      setReviews(updatedReviews)
    } catch (err) {
      console.error('Gagal kirim review:', err)
    }
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <img src={book.bookPicture} alt={book.title} className="w-64 h-96 object-cover rounded my-4" />
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <p><strong>Penerbit:</strong> {book.publisherName}</p>
      <p><strong>Rating:</strong> {book.rating}</p>
      <p><strong>Penulis:</strong> {book.authorNames.join(', ')}</p>
      <p><strong>Genre:</strong> {book.genreNames.join(', ')}</p>
      <p><strong>Sinopsis:</strong> {book.synopsis}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Tulis Review</h2>
        <form onSubmit={handleSubmitReview} className="space-y-2">
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Apa pendapatmu tentang buku ini?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <input
            type="number"
            min={0}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-20 border p-1 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Kirim Review
          </button>
        </form>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Review Pembaca</h2>
        {reviews.length === 0 ? (
          <p>Belum ada review.</p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="border-t pt-2 mt-2">
              <p className="text-sm italic">"{review.message}"</p>
              <p className="text-xs text-gray-600">
                Rating: {review.rating} | {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
