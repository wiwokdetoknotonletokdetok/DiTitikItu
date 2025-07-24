import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import BookCard from '@/components/BookCard'
import { useEffect, useState } from 'react'
import { getRecommendationsBooks } from '@/api/recommendationsBooks.ts'
import { useAuth } from '@/context/AuthContext.tsx'

type Props = {
  onSelectBook: (id: string) => void
  contentRef: React.RefObject<HTMLDivElement | null> 
}

export default function HomeContent({ onSelectBook, contentRef }: Props) {
  const [recommendations, setRecommendations] = useState<BookSummaryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const { token, isLoggedIn } = useAuth()

  useEffect(() => {
    if (!token && isLoggedIn()) return
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const res = await getRecommendationsBooks(8, token)
        setRecommendations(res.data)
      } catch (err) {
        console.error('Gagal mengambil data buku:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [token])

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
          />
        ))
      )}
    </div>
  )
}
