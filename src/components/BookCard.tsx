import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'

interface Props {
  book: BookSummaryDTO
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) {
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
      <p className="text-sm">Rating: {book.rating}</p>
      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
      <p className="text-xs mt-1">Genre: {book.genreNames.join(', ')}</p>
      <p className="text-xs">Author: {book.authorNames.join(', ')}</p>
    </div>
  )
}
