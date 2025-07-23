import { useState } from 'react'
import { postReview } from '@/api/reviews'
import { ApiError } from '@/exception/ApiError'
import StarRatingInput from '@/components/StarRatingInput'
import Tooltip from '@/components/Tooltip'
import { Send } from 'lucide-react'
import Modal from '@/components/Modal.tsx'
import LoginPromptContent from '@/components/LoginPromptContent'
import { useAuth } from '@/context/AuthContext'

interface AddBookReviewFormProps {
  bookId: string
  onUpdateReviews: () => void
}

export default function BookReviewForm({ bookId, onUpdateReviews }: AddBookReviewFormProps) {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { isLoggedIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await postReview(bookId, { message, rating })
      setMessage('')
      setRating(0)
      onUpdateReviews()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || err.errors?.[0] || 'Terjadi kesalahan.')
      }
    }
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Tulis Ulasan</h2>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            className="w-5/6 border border-gray-300 rounded-lg p-3 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-[#1E497C]"
            rows={3}
            placeholder="Apa pendapatmu tentang buku ini?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="absolute bottom-4 right-4">
            <Tooltip message="Kirim ulasan">
              {isLoggedIn() ? (
              <button
                type="submit"
                className="w-[36px] h-[36px] rounded-full text-white bg-[#1E497C] hover:bg-[#5C8BC1] shadow flex items-center justify-center transition"
                aria-label="Kirim ulasan"
              >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="#login-required"
                  className="w-[36px] h-[36px] rounded-full text-white bg-[#1E497C] hover:bg-[#5C8BC1] shadow flex items-center justify-center transition"
                  aria-label="Login untuk mengulas"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
            </Tooltip>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        <Modal hash="#reviews">
          <h2 className="text-xl font-semibold mb-4">Ulasan</h2>
          <LoginPromptContent />
        </Modal>
    </div>
  )
}
