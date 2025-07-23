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

  return (
      <div>
        {myReview && (
          <div className="pt-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Link to={`/profile/${myReview.userId}`}>
                <img
                  src={myReview.profilePicture}
                  alt={myReview.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow"
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
          <div key={i} className="pt-3 mt-3 border-gray-300">
            <div className="flex items-center gap-2 mb-1">
               <Link to={`/profile/${r.userId}`}>
                <img
                  src={r.profilePicture}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow"
                />
               </Link>
              <span>
                <Link
                  to={`/profile/${r.userId}`}
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    setModalPosition({ x: rect.right + 10, y: rect.top })
                    setPreviewUser(r)
                  }}
                  onMouseLeave={() => {
                    hoverTimeout.current = setTimeout(() => {
                      setPreviewUser(null)
                    }, 300)
                  }}
                  className="text-sm font-semibold text-[#1C2C4C]"
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
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64"
            style={{
              top: modalPosition.y,
              left: modalPosition.x,
              position: 'absolute',
            }}
            onMouseEnter={() => {
              if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
            }}
            onMouseLeave={() => {
              setPreviewUser(null)
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={previewUser.profilePicture}
                alt={previewUser.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-sm">{previewUser.name}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 italic">"{previewUser.message}"</p>
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
