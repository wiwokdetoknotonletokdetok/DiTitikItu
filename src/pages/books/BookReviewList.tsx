import type { ReviewResponseDTO } from '@/dto/ReviewResponseDTO'
import { deleteReview, updateReview } from '@/api/reviews'
import { useState } from 'react'

interface BookReviewListProps {
  reviews: ReviewResponseDTO[]
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
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Review Pembaca</h2>

      {/* --- Review Milik Sendiri --- */}
      {myReview && (
        <div className="border rounded p-4 mb-4 bg-gray-50">
          <h3 className="text-md font-semibold mb-2">Review Kamu</h3>
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              <textarea
                className="w-full border rounded p-2"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                required
              />
              <input
                type="number"
                min={0}
                max={5}
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-20 border p-1 rounded"
                required
              />
              <div className="space-x-2">
                <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Simpan</button>
                <button type="button" onClick={() => setEditing(false)} className="text-gray-600">Batal</button>
              </div>
            </form>
          ) : (
            <>
              <p className="italic text-sm">"{myReview.message}"</p>
              <p className="text-xs text-gray-600">
                Rating: {myReview.rating} | {new Date(myReview.createdAt).toLocaleString()}
              </p>
              <div className="space-x-2 mt-1">
                <button onClick={() => setEditing(true)} className="text-sm text-blue-600">Edit</button>
                <button onClick={handleDelete} className="text-sm text-red-600">Hapus</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Review Orang Lain --- */}
      {otherReviews.length === 0 ? (
        <p className="text-sm text-gray-500">Belum ada review dari pengguna lain.</p>
      ) : (
        <div className="space-y-4">
          {otherReviews.map((r, i) => (
            <div key={i} className="border-t pt-2 mt-2">
              <p className="text-sm italic">"{r.message}"</p>
              <p className="text-xs text-gray-600">
                Rating: {r.rating} | {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
