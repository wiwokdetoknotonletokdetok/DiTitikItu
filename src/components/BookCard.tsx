import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { useAuth } from '@/context/AuthContext'
import { addBookToCollection } from '@/api/collections'

interface Props {
  book: BookSummaryDTO
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) {
  const { userId } = useAuth()
  const isLoggedIn = !!userId

  const handleAddToCollection = async () => {
    try {
      await addBookToCollection(book.id)
      alert('Buku berhasil ditambahkan ke koleksi!')
    } catch (error) {
      alert('Gagal menambahkan buku ke koleksi.')
      console.error(error)
    }
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg p-4 shadow-sm hover:shadow-md transition"
    >
      <img
        src={book.bookPicture}
        alt={book.title}
        className="w-full h-48 object-cover mb-2 rounded"
      />
      <h3 className="font-semibold text-lg">{book.title}</h3>
      <p className="text-sm">Penerbit: {book.publisherName}</p>
      <p className="text-sm">Rating: {book.totalRatings}</p>
      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
      <p className="text-xs mt-1">Genre: {book.genreNames.join(', ')}</p>
      <p className="text-xs">Author: {book.authorNames.join(', ')}</p>
      <button type="button">Edit</button>

      {isLoggedIn && (
        <button
          type="button"
          title="Tambah buku ini ke koleksi Anda"
          onClick={(e) => {
            e.stopPropagation()
            handleAddToCollection()
          }}
          className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          ＋ Tambah ke Koleksi
        </button>
      )}
    </div>
  )
}
