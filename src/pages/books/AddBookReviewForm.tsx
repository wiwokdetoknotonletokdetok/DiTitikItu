import { useState } from 'react'
import { postReview } from '@/api/reviews'
import { ApiError } from '@/exception/ApiError'
import StarRatingInput from '@/components/StarRatingInput'

interface AddBookReviewFormProps {
  bookId: string
  onSuccess: () => void
}

export default function BookReviewForm({ bookId, onSuccess }: AddBookReviewFormProps) {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await postReview(bookId, { message, rating })
      setMessage('')
      setRating(0)
      onSuccess()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || err.errors?.[0] || "Terjadi kesalahan.")
      }
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-l font-semibold">Tulis Review</h2>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          className="w-full border rounded p-2 resize-none"
          rows={3}
          placeholder="Apa pendapatmu tentang buku ini?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-[#1E497C] text-white px-4 py-1 rounded hover:bg-[#5C8BC1]"
        >
          Kirim Review
        </button>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      </form>
    </div>

  )
}
