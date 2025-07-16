import { useEffect, useState } from 'react'
import { fetchBooks } from '@/api/books'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { useNavigate } from 'react-router-dom'
import BookCard from '@/components/BookCard'
import MapView from '@/components/MapView'
import BookSearchBar from '@/components/SearchBar'

export default function BookList() {
  const [books, setBooks] = useState<BookSummaryDTO[]>([])
  const navigate = useNavigate()

  const dummyBooks = [
    { id: '1', title: 'Pemrograman Java', lat: -6.2, lng: 106.8 },
    { id: '2', title: 'Spring Boot', lat: -6.21, lng: 106.83 }
  ]

  const handleSearch = async (params: {
    title?: string
    isbn?: string
    author?: string
    genre?: string
    publisher?: string
  }) => {
    try {
      const result = await fetchBooks(params)
      setBooks(result)
    } catch (err) {
      console.error('Gagal fetch buku:', err)
    }
  }

  useEffect(() => {
    handleSearch({})
  }, [])

  return (
    <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#1C2C4C]">📚 Daftar Buku</h1>
          <a href="/books/new" className="text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] px-4 py-2 rounded-md shadow-sm transition" >
            + Tambah Buku Baru
          </a>
        </div>

        <div className="mb-6">
          <BookSearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-6">
          <MapView books={dummyBooks} />
        </div>

        {books.length === 0 ? (
          <p className="text-gray-600 mt-4 text-center">Tidak ada buku yang ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/books/${book.id}`)}
                onUpdate={() => handleSearch({})}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
