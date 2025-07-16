import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO'
import { deleteReview, updateReview } from '@/api/reviews'
import { useState } from 'react'

interface BookReviewListProps {
  reviews: ReviewWithUserDTO[]
  bookId: string
  onUpdate: () => void
}

export default function BookReviewList({ reviews, bookId, onUpdate }: BookReviewListProps) {
  const userId = localStorage.getItem("userId")

  const myReview = reviews.find((r) => r.userId === userId)
  const otherReviews = reviews.filter((r) => r.userId !== userId)

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

      {/* --- Review Milik Sendiri --- */}
      {myReview && (
        <div className="border border-[#2E7D32] rounded-lg p-4 mb-6 bg-[#A5D6A7]/20">
          <div className="flex items-center mb-3 gap-4">
            <img  src={myReview.profilePicture} alt="Foto Profil" className="w-[100px] h-[100px] rounded-full object-cover border-2 border-[#1E497C]"/>
            <h3 className="text-lg font-semibold text-[#1C2C4C]">{myReview.name}</h3>
          </div>
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              <textarea className="w-full border border-[#1E497C] rounded-md p-2 text-sm" value={editMessage} onChange={(e) => setEditMessage(e.target.value)} required/>
              <input type="number" min={0} max={5} value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} className="w-24 border border-[#1E497C] p-1 rounded-md text-sm" required/>
              <div className="space-x-2">
                <button type="submit" className="bg-[#2E7D32] hover:bg-[#1e5e26] text-white px-3 py-1 rounded-md text-sm"> Simpan </button>
                <button type="button" onClick={() => setEditing(false)} className="text-gray-600 text-sm">
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="italic text-sm text-[#1C2C4C]">"{myReview.message}"</p>
              <p className="text-xs text-gray-600 mt-1">
                Rating: {myReview.rating} | {new Date(myReview.createdAt).toLocaleString()}
              </p>
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

      {/* --- Review Orang Lain --- */}
      <div className="space-y-4">
        {otherReviews.map((r, i) => (
          <div key={i} className="border-t pt-3 mt-3 border-[#2E7D32]/50">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={r.profilePicture}
                alt={r.name}
                className="w-10 h-10 rounded-full object-cover border border-[#1E497C]"
              />
              <span className="text-sm font-semibold text-[#1C2C4C]">{r.name}</span>
            </div>
            <p className="text-sm italic text-[#1C2C4C]">"{r.message}"</p>
            <p className="text-xs text-gray-600">
              Rating: {r.rating} | {new Date(r.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
      )
}
