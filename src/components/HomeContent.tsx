import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import BookCard from '@/components/BookCard'

type Props = {
  books: BookSummaryDTO[]
  loading: boolean
  onSelectBook: (id: string) => void
  contentRef: React.RefObject<HTMLDivElement>
}

export default function HomeContent({ books, loading, onSelectBook, contentRef }: Props) {
  return (
    <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => onSelectBook(book.id)} />
        ))
      )}
    </div>
  )
}
