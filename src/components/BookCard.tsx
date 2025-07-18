import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import type { BookAIResultDTO } from '@/dto/BookAIResultDTO'

interface Props {
  book: Partial<BookSummaryDTO & BookAIResultDTO>;
  onClick?: () => void
  onUpdate?: () => void
}

export default function BookCard({ book, onClick, onUpdate}: Props) { 
  return (
    <div className='border rounded-lg p-4 shadow-sm hover:shadow-md transition'>
      <div onClick={onClick} className="cursor-pointer py-2">
        <img
          src={book.bookPicture}
          alt={book.title}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = 'https://placehold.co/300x450?text=Book'
          }}
          className="w-full max-w-sm aspect-[2/3] object-cover rounded shadow"
        />
        <h3 className="font-semibold text-lg">{book.title}</h3>
        {book.publisherName && <p className="text-sm">Penerbit: {book.publisherName}</p>}
        {book.totalRatings !== undefined && <p className="text-sm">Rating: {book.totalRatings}</p>}
        {book.isbn && <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>}
        {Array.isArray(book.genreNames) && book.genreNames.length > 0 && (
          <p className="text-xs mt-1">Genre: {book.genreNames.join(', ')}</p>
        )}
        {Array.isArray(book.authorNames) && book.authorNames.length > 0 && (
          <p className="text-xs">Author: {book.authorNames.join(', ')}</p>
        )}
      </div>
      {onUpdate && (
        <button
          onClick={onUpdate}
          className="text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] px-4 py-2 rounded-md shadow-sm transition"
        >
          ✏️ Edit
        </button>
      )}

    </div>
  )
}
