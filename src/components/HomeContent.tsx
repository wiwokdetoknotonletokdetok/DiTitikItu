import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import BookCard from '@/components/BookCard'
import { useEffect, useState } from 'react'
import { getRecommendationsBooks } from '@/api/recommendationsBooks.ts'
import { addBookToCollection } from '@/api/collections'
import toast from 'react-hot-toast'

type Props = {
  onSelectBook: (id: string) => void
  contentRef: React.RefObject<HTMLDivElement | null> 
}

export default function HomeContent({ onSelectBook, contentRef }: Props) {
  const [recommendations, setRecommendations] = useState<BookSummaryDTO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await getRecommendationsBooks()
        setRecommendations(res.data)
      } catch (err) {
        console.error('Gagal mengambil data buku:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  return (
    <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        recommendations.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onSelectBook(book.id)}
            showAddToCollectionButton
            onAddToCollection={async (bookId) => {
              try {
                await addBookToCollection(bookId)
                toast.success('Buku berhasil ditambahkan ke koleksi!')
              } catch (error) {
                console.error(error)
                toast.error('Gagal menambahkan buku ke koleksi.')
              }
            }}
          />
        ))
      )}
    </div>
  )
}
