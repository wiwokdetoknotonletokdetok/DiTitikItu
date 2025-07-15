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
      console.log('Fetched books:', result)
      setBooks(result)
    } catch (err) {
      console.error('Gagal fetch buku:', err)
    }
  }

  useEffect(() => {
    handleSearch({})
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Buku</h1>
      <a href="/books/new" className="text-blue-600 underline">+ Tambah Buku Baru</a>

      <div className="my-4">
        <BookSearchBar onSearch={handleSearch} />
      </div>

      <MapView books={dummyBooks} />

      {books.length === 0 ? (
        <p className="text-gray-600 mt-4">Tidak ada buku yang ditemukan.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/books/${book.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
