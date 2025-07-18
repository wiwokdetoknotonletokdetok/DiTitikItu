import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import { deleteReview, updateReview } from '@/api/reviews'
import { useEffect, useState } from 'react'
import StarRatingInput from '@/components/StarRatingInput'
import { Link } from 'react-router-dom';

interface BookReviewListProps {
  reviews: ReviewWithUserDTO[]
  bookId: string
  onUpdate: () => void
}

export default function BookReviewList({ reviews, bookId, onUpdate }: BookReviewListProps) {
  const userId = localStorage.getItem("userId")

  const myReview = reviews.find((r) => r.userId === userId)
  const otherReviews = reviews.filter((r) => r.userId !== userId)

  useEffect(() => {
    if (myReview) {
      setEditMessage(myReview.message)
      setEditRating(myReview.rating)
    }
  }, [myReview])

  const [editing, setEditing] = useState(false)
  const [editMessage, setEditMessage] = useState(myReview?.message || '')
  const [editRating, setEditRating] = useState(myReview?.rating || 0)

  const handleDelete = async () => {
    try {
      await deleteReview(bookId, myReview!.userId)
      onUpdate()
    } catch (err) {
      console.error('Gagal menghapus review:', err)
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
      onUpdate()
    } catch (err) {
      console.error('Gagal mengedit review:', err)
    }
  }

  return (
    <div className="mt-6 bg-[#FAFAFA] p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-[#1C2C4C]">Review Pembaca</h2>

      {reviews.length === 0 && (
        <p className="text-gray-500 italic">Belum ada review untuk buku ini.</p>
      )}

      {myReview && (
        <div className="border rounded p-4 mb-4 bg-gray-50">
          <Link 
          to={`/profile/${myReview.userId}`} 
          className="flex items-center mb-2 gap-2 hover:underline"
        >
          <img 
            src={myReview.profilePicture} 
            alt="Foto Profil" 
            style={{
              width: '200px', 
              height: '200px', 
              borderRadius: '50%', 
              overflow: 'hidden'
            }} 
          />
          <h3 className="text-md font-semibold">{myReview.name}</h3>
        </Link>
          <div className="border border-[#2E7D32] rounded-lg p-4 mb-6 bg-[#A5D6A7]/20">
            <div className="flex items-center gap-2 mb-1">
              <img src={myReview.profilePicture} alt={myReview.name} className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"/>
              <span>
                <p className="text-sm font-semibold text-[#1C2C4C]">{myReview.name}</p>
                <p className="text-xs text-gray-600">
                  {getFormattedReviewDate(myReview.createdAt, myReview.updatedAt)}
                </p>
              </span>
            </div>
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-2">
                <StarRatingInput value={editRating} onChange={setEditRating} />
                <textarea className="w-full border border-[#1E497C] rounded-md p-2 text-sm resize-none" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} required/>
                <div className="space-x-2">
                  <button type="submit" className="bg-[#1E497C] hover:bg-[#5C8BC1] text-white px-3 py-1 rounded-md text-sm"> Simpan </button>
                  <button type="button" onClick={() => {
                      setEditing(false)
                      setEditMessage(myReview.message)
                      setEditRating(myReview.rating)
                    }} 
                    className="text-gray-600 text-sm"> 
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

                <p className="text-sm italic text-[#1C2C4C]">{myReview.message}</p>

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
        </div>
      )}

      {/* --- Review Orang Lain --- */}
        <div className="space-y-4">
          {otherReviews.map((r, i) => (
            <div key={i} className="border-t pt-2 mt-2">
              <Link to={`/profile/${r.userId}`} className="flex items-center gap-2 mb-1 hover:underline">
                <img src={r.profilePicture} alt={r.name} className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{r.name}</span>
              </Link>
              <p className="text-sm italic">"{r.message}"</p>
              <p className="text-xs text-gray-600">
                Rating: {r.rating} | {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      <div className="space-y-4">
        {otherReviews.map((r, i) => (
          <div key={i} className="border-t pt-3 mt-3 border-[#2E7D32]/50">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={r.profilePicture}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"
              />
              <span>
                <p className="text-sm font-semibold text-[#1C2C4C]">
                  {r.name}
                </p>
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
            <p className="text-sm italic text-[#1C2C4C]">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getFormattedReviewDate(createdAt: string, updatedAt?: string) {
  const date = new Date(updatedAt || createdAt)
  const label = updatedAt ? 'Diedit pada' : ''
  return `${label} ${date.toLocaleString()}`
}
