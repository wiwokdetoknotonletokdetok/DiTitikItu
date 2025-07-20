import { useEffect, useState } from 'react'
import MapView from '@/components/MapView'
import BookSearchBar from '@/components/SearchBar'
import type {BookSummaryDTO} from "@/dto/BookSummaryDTO.ts";
import {fetchBooks} from "@/api/books.ts";
import {searchBooks} from "@/api/getBooksSemantic.ts";
import BookCard from "@/components/BookCard.tsx";
import BookLocationList from '@/pages/books/BookLocationList'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { fetchBookLocations } from '@/api/bookLocation'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import { useUserLocation } from '@/context/LocationContext'

export default function Home() {
  const [advancedBooks, setAdvancedBooks] = useState<BookSummaryDTO[]>([])
  const [aiBooks, setAiBooks] = useState<BookSummaryDTO[]>([])
  const [selectedBook, setSelectedBook] = useState<BookSummaryDTO | null>(null)
  const navigate = useNavigate()
  const [bookLocations, setBookLocations] = useState<BookLocationResponse[]>([])
  const userPosition = useUserLocation()

  const handleSearch = async (params: {
    title?: string
    isbn?: string
    author?: string
    genre?: string
    publisher?: string
  }) => {
    try {
      const advancedResults = await fetchBooks(params)
      setAdvancedBooks(advancedResults)

      if (advancedResults.length === 0 && params.title) {
        const aiRawResults = await searchBooks(params.title)
        const aiMapped = aiRawResults.map((book: BookSummaryDTO) => ({
          id: book.id,
          title: book.title,
          bookPicture: book.bookPicture,
        }))
        setAiBooks(aiMapped)
      } else {
        setAiBooks([])
      }
    } catch (err) {
      console.error('Gagal fetch buku:', err)
    }
  }
  
  const fetchLocationsForSelectedBook = async (bookId: string) => {
    if (!userPosition) return 
    try {
      const locs = await fetchBookLocations(bookId, userPosition.latitude, userPosition.longitude)
      setBookLocations(locs)
    } catch (err) {
      console.error('Gagal fetch lokasi buku:', err)
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

        <div className="flex flex-col lg:flex-row gap-4">
          <div className={`transition-all duration-500 ${selectedBook ? 'lg:w-2/3' : 'w-full'}`}>
            <MapView userPosition={userPosition!} bookLocations={selectedBook ? bookLocations : []} />
          </div>

          {selectedBook && (
            <div className="lg:w-1/3 bg-white rounded-lg shadow p-4 relative">
              <div>
                <h2 className="text-lg font-semibold text-[#1C2C4C] mb-2">📍 Lokasi Buku {selectedBook.title}</h2>
                <X
                  className="absolute right-4 top-4 text-black cursor-pointer h-4 w-4 hover:text-[#E53935]"
                  onClick={() => {
                    setSelectedBook(null)
                    setBookLocations([])
                  }}
                />
              </div>
              <BookLocationList bookId={selectedBook.id} locations={bookLocations} onRefresh={() => fetchLocationsForSelectedBook(selectedBook.id)} />
              <button
                onClick={() => {
                  setSelectedBook(null)
                  navigate(`/books/${selectedBook.id}`)
                }}
                className="mt-4 w-full text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] py-2 rounded-md"
              >
                Lihat Buku Lebih Lengkap
              </button>
            </div>
          )}
        </div>

        {advancedBooks.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {advancedBooks.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onClick={() => {
                          setSelectedBook(book)
                          fetchLocationsForSelectedBook(book.id)
                        }}
                    />
                ))}
              </div>
            </>
        )}

        {aiBooks.length > 0 && (
            <>
              <h2 className="text-lg font-bold text-[#1E497C] mt-8 mb-2">Mungkin maksud Anda</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {aiBooks.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        onClick={() => setSelectedBook(book)}
                    />
                ))}
              </div>
            </>
        )}

        {advancedBooks.length === 0 && aiBooks.length === 0 && (
            <p className="text-gray-600 mt-4 text-center">Tidak ada buku yang ditemukan.</p>
        )}
      </div>
    </div>
  )
}
