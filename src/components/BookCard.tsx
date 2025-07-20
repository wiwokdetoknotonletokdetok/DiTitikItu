import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { useNavigate } from 'react-router-dom'

interface Props {
  book: BookSummaryDTO
  onClick?: () => void
}

export default function BookCard({ book, onClick }: Props) { 
  const navigate = useNavigate()

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
      </div>
      <button onClick={() => navigate(`/books/editBook/${book.id}`)} className="text-sm text-white bg-[#1E497C] hover:bg-[#5C8BC1] px-4 py-2 rounded-md shadow-sm transition">
        ✏️ Edit
      </button>
    </div>
  )
}
