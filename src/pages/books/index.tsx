import { useEffect, useState } from 'react'
import { fetchBooks } from '@/api/books'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { useNavigate } from 'react-router-dom'
import BookCard from '@/components/BookCard'

export default function BookList() {
  const [books, setBooks] = useState<BookSummaryDTO[]>([])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchBooks()
      .then(data => setBooks(data))
      .catch(err => console.error('Error:', err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Buku</h1>
      <a href="/books/new" className="text-blue-600 underline">+ Tambah Buku Baru</a>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => navigate(`/books/${book.id}`)}
          />
        ))}
      </div>
    </div>
  )
}