import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchUserBooks, removeBookFromUser, countUserBooks } from '@/api/collections'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'

export default function UserCollection() {
  const { userId: paramUserId } = useParams<{ userId: string }>()
  const { userId: authUserId } = useAuth()

  const userId = paramUserId
  const navigate = useNavigate()
  const [books, setBooks] = useState<BookSummaryDTO[]>([])
  const [total, setTotal] = useState<number>(0)

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

  const handleRemove = async (bookId: string, bookTitle: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus "${bookTitle}" dari koleksi?`)
    if (!confirmDelete) return

    try {
        await removeBookFromUser(bookId)
        setBooks(prev => prev.filter(book => book.id !== bookId))
        setTotal(prev => prev - 1)
        alert('Buku berhasil dihapus dari koleksi.')
    } catch (error) {
        console.error('Gagal hapus buku:', error)
        alert('Gagal menghapus buku dari koleksi.')
    }
    }


  if (!userId) return <p>Anda belum login.</p>

  return (
    <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Koleksi Buku Saya</h2>
        <p className="mb-4 text-gray-600">Total koleksi: {total} buku</p>

        {books.length === 0 ? (
        <p>Belum ada buku dalam koleksi.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.map(book => (
            <div
                key={book.id}
                onClick={() => navigate(`/books/${book.id}`)}
                className="relative border p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
                <img
                src={book.bookPicture}
                alt={book.title}
                className="w-full h-48 object-cover mb-2 rounded"
                />
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.publisherName}</p>
                {authUserId === paramUserId && (
                    <button
                        onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(book.id, book.title)
                        }}
                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                )}
            </div>
            ))}
        </div>
        )}
    </div>
    )
}
