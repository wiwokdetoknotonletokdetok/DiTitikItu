import { useState } from 'react'
import { postReview } from '@/api/reviews'

interface AddBookReviewFormProps {
  bookId: string
  onSuccess: () => void
}

export default function BookReviewForm({ bookId, onSuccess }: AddBookReviewFormProps) {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postReview(bookId, { message, rating })
      setMessage('')
      setRating(0)
      onSuccess()
    } catch (err) {
      console.error('Gagal kirim review:', err)
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Tulis Review</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Apa pendapatmu tentang buku ini?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        /> <br />
        <input
          type="number"
          min={0}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-20 border p-1 rounded"
          required
        /> <br /><br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Kirim Review
        </button>
      </form>
    </div>
  )
}
