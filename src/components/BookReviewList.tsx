import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import { deleteReview, updateReview } from '@/api/reviews'
import { useEffect, useState } from 'react'
import StarRatingInput from '@/components/StarRatingInput'
import { ApiError } from '@/exception/ApiError'
import { useAuth } from '@/context/AuthContext.tsx'
import { Link } from 'react-router-dom'
import { useRef } from 'react'


interface BookReviewListProps {
  reviews: ReviewWithUserDTO[]
  bookId: string
  onUpdateReviews: () => void
}

export default function BookReviewList({ reviews, bookId, onUpdateReviews }: BookReviewListProps) {
  const { user } = useAuth()
  const myReview = reviews.find((r) => r.userId === user?.id)
  const otherReviews = reviews.filter((r) => r.userId !== user?.id)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (myReview) {
      setEditMessage(myReview.message)
      setEditRating(myReview.rating)
    }
  }, [myReview])

  const [editing, setEditing] = useState(false)
  const [editMessage, setEditMessage] = useState(myReview?.message || '')
  const [editRating, setEditRating] = useState(myReview?.rating || 0)
  const [error, setError] = useState<string | null>(null)
  const [previewUser, setPreviewUser] = useState<ReviewWithUserDTO | null>(null)
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | null>(null)

  const handleDelete = async () => {
    try {
      await deleteReview(bookId, myReview!.userId)
      onUpdateReviews()
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Gagal menghapus review:', err)
        setError(err.message || err.errors?.[0] || "Terjadi kesalahan.")
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateReview(bookId, myReview!.userId, {
        message: editMessage,
        rating: editRating
      })
      setEditing(false)
      onUpdateReviews()
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Gagal menghapus review:', err)
        setError(err.message || err.errors?.[0] || "Terjadi kesalahan.")
      }
    }
  }

const showPreviewTimeout = useRef<NodeJS.Timeout | null>(null)

const handleReviewMouseEnter = (e: React.MouseEvent, review: ReviewWithUserDTO) => {
  if (hoverTimeout.current) {
    clearTimeout(hoverTimeout.current)
  }
  if (showPreviewTimeout.current) {
    clearTimeout(showPreviewTimeout.current)
  }

  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const containerRect = target.closest('.relative')?.getBoundingClientRect()
  if (!containerRect) return

  const modalWidth = 256
  const modalHeight = 192

  let x = rect.left - containerRect.left + rect.width + 8
  let y: number

  const isMyReview = review.userId === user?.id
  if (isMyReview) {
    y = rect.top - containerRect.top - modalHeight - 10
  } else {
    y = rect.top - containerRect.top - 10
  }

  if (x < 10) x = 10
  if (x + modalWidth > containerRect.width - 10) {
    x = containerRect.width - modalWidth - 10
  }
  if (y < 10) y = 10

  showPreviewTimeout.current = setTimeout(() => {
    setModalPosition({ x, y })
    setPreviewUser(review)
  }, 300)
}


const handleReviewMouseLeave = () => {
  if (hoverTimeout.current) {
    clearTimeout(hoverTimeout.current)
  }
  if (showPreviewTimeout.current) {
    clearTimeout(showPreviewTimeout.current)
  }

  hoverTimeout.current = setTimeout(() => {
    setPreviewUser(null)
    setModalPosition(null)
  }, 300)
}

  const handleModalMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
    }
  }

  const handleModalMouseLeave = () => {
    setPreviewUser(null)
    setModalPosition(null)
  }

  return (
      <div className="relative">
        {myReview && (
          <div className="pt-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
            <Link to={`/profile/${myReview.userId}`}>
                <img
                  src={myReview.profilePicture}
                  alt={myReview.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"
                />
              </Link>
              <span>
                <Link
                  to={`/profile/${myReview.userId}`}
                  className="text-sm font-semibold text-[#1C2C4C]"
                >
                  {myReview.name}
                </Link>
                <p className="text-xs text-gray-600">
                  {getFormattedReviewDate(myReview.createdAt, myReview.updatedAt)}
                </p>
              </span>
            </div>

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-2 mt-2">
                <StarRatingInput value={editRating} onChange={setEditRating} />
                <textarea
                  className="w-full border border-[#1E497C] rounded-md p-2 text-sm resize-none"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  required
                />
                <div className="space-x-2">
                  <button
                    type="submit"
                    className="bg-[#1E497C] hover:bg-[#5C8BC1] text-white px-3 py-1 rounded-md text-sm"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      setEditMessage(myReview.message)
                      setEditRating(myReview.rating)
                      setError(null)
                    }}
                    className="text-gray-600 text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-xs text-yellow-600">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index}>
                      {index < myReview.rating ? '★' : '☆'}
                    </span>
                  ))}
                </p>
                <p className="text-sm text-[#1C2C4C] mt-1">{myReview.message}</p>
                <div className="space-x-3 mt-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-[#1E497C] hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-[#E53935] hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {otherReviews.map((r, i) => (
          <div 
            key={i} 
            className="pt-3 mt-3 border-gray-300 hover:bg-gray-50 rounded-md p-2 transition-colors"
          >
            <div 
              className="flex items-center gap-2 mb-1"
              onMouseEnter={(e) => handleReviewMouseEnter(e, r)}
              onMouseLeave={handleReviewMouseLeave}
            >
              <Link to={`/profile/${r.userId}`}>
                <img
                  src={r.profilePicture}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"
                />
              </Link>
              <span>
                <Link
                  to={`/profile/${r.userId}`}
                  className="text-sm font-semibold text-[#1C2C4C] hover:underline"
                >
                  {r.name}
                </Link>
                <p className="text-xs text-gray-600">
                  {getFormattedReviewDate(r.createdAt, r.updatedAt)}
                </p>
              </span>
            </div>
            <p className="text-xs text-yellow-600">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>
                  {index < r.rating ? '★' : '☆'}
                </span>
              ))}
            </p>
            <p className="text-sm text-[#1C2C4C] mt-1">{r.message}</p>
          </div>
        ))}
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        {previewUser && modalPosition && (
          <div
            className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-64 max-h-64 overflow-hidden transition-opacity"
            style={{
              top: modalPosition.y,
              left: modalPosition.x,
            }}
            onMouseEnter={handleModalMouseEnter}
            onMouseLeave={handleModalMouseLeave}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={previewUser.profilePicture}
                alt={previewUser.name}
                className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1C2C4C]">{previewUser.name}</p>
                <p className="text-xs text-gray-500">{previewUser.points} poin</p>
              </div>
            </div>

            <p className="text-xs italic text-gray-600 mb-2 line-clamp-2">
              {previewUser.bio || 'Tidak ada bio'}
            </p>
          </div>
        )}
    </div>
  )
}

function getFormattedReviewDate(createdAt: string, updatedAt?: string) {
  const date = new Date(updatedAt || createdAt)
  const label = updatedAt ? 'Diedit pada' : ''
  return `${label} ${date.toLocaleString()}`
}