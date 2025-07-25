import { useState } from 'react'
import { postReview } from '@/api/reviews'
import { ApiError } from '@/exception/ApiError'
import StarRatingInput from '@/components/StarRatingInput'
import Tooltip from '@/components/Tooltip'
import { Send } from 'lucide-react'
import Modal from '@/components/Modal.tsx'
import LoginPromptContent from '@/components/LoginPromptContent'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface AddBookReviewFormProps {
  bookId: string
  onUpdateReviews: () => void
  isDisabled?: boolean
}

export default function BookReviewForm({ bookId, onUpdateReviews, isDisabled }: AddBookReviewFormProps) {
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await postReview(bookId, { message: message.trim(), rating })
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
          <div className="mr-12">
            <textarea
                disabled={isDisabled}
                className={`w-full block resize-none text-sm border rounded-md py-2 px-3 outline-none placeholder:text-sm ${
                  isDisabled
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:border-[#1E497C]'
                }`}
                rows={3}
                placeholder="Apa pendapatmu tentang buku ini?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
          </div>

          <div className="absolute bottom-1 right-1">
            <Tooltip message={isDisabled ? 'Kamu sudah memberikan ulasan' : (!isLoggedIn() ? 'Login untuk mengulas' : 'Kirim ulasan')}>
                <button
                  type={!isLoggedIn() || isDisabled ? 'button' : 'submit'}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isLoggedIn()) navigate('#review')
                  }}
                  className={`w-[36px] h-[36px] rounded-full text-white shadow flex items-center justify-center transition ${
                    isDisabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#1E497C] hover:bg-[#5C8BC1]'
                  }`}
                  aria-label="Kirim ulasan"
                >
                  <Send size={20} style={{ transform: 'translate(-1px, 1px)' }} />
                </button>
              </Tooltip>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <Modal hash="#reviews">
        <h2 className="text-xl font-semibold mb-4">Ulasan</h2>
        <LoginPromptContent/>
      </Modal>
    </div>
  )
}
