import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchUserBooks, removeBookFromUser, countUserBooks } from '@/api/collections'
import { useNavigate } from 'react-router-dom'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import BookCard from '@/components/BookCard'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import Navbar from '@/components/Navbar'

export default function UserCollection() {
  const { user } = useAuth()
  const userId = user?.id
  const navigate = useNavigate()
  const [books, setBooks] = useState<BookSummaryDTO[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    if (userId) {
      fetchUserBooks(userId)
        .then(setBooks)
        .catch(err => console.error('Gagal fetch koleksi:', err))

      countUserBooks(userId)
        .then(setTotal)
        .catch(err => console.error('Gagal hitung koleksi:', err))
    }
  }, [userId])

  const handleRemove = async () => {
    if (!pendingDelete) return
    const { id: bookId } = pendingDelete
    const toastId = toast.loading('Menghapus buku...')

    try {
      await removeBookFromUser(bookId)
      setBooks(prev => prev.filter(book => book.id !== bookId))
      setTotal(prev => prev - 1)
      toast.success('Buku berhasil dihapus.', { id: toastId })
    } catch (err) {
      toast.error('Gagal menghapus buku.', { id: toastId })
    } finally {
      setPendingDelete(null)
    }
  }

  if (!userId) return <p className="p-6">Anda belum login.</p>

  return (
  <>
    <Navbar />

    {/* lebar sama seperti home (≥7xl) + padding */}
    <div className="max-w-7xl mx-auto px-4 py-8">    
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Koleksi Buku Saya</h1>
      <p className="mb-6 text-gray-600">Total koleksi: {total} buku</p>

      {books.length === 0 ? (
        <p>Belum ada buku dalam koleksi.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map(book => (
            <div key={book.id} className="relative">
              <BookCard
                book={book}
                onClick={() => navigate(`/books/${book.id}`)}
                showRemoveButton
                onRemove={() => setPendingDelete({ id: book.id, title: book.title })}
              />
            </div>
          ))}
        </div>
      )}
    </div>

    <ConfirmDialog
    open={!!pendingDelete}
    message={`Apakah Anda yakin ingin menghapus "${pendingDelete?.title}" dari koleksi?`}
    onConfirm={handleRemove}
    onCancel={() => setPendingDelete(null)}
    />
    </>
  )
}
