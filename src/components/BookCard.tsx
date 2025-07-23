import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { Plus } from 'lucide-react'

interface Props {
  book: BookSummaryDTO
  onClick?: () => void
  showAddToCollectionButton?: boolean
  onAddToCollection?: (bookId: string) => void
}

export default function BookCard({ book, onClick, showAddToCollectionButton, onAddToCollection }: Props) {
  return (
    <div
      className='relative rounded-lg overflow-hidden group cursor-pointer'
      onClick={onClick}
    >
      <img
        src={book.bookPicture}
        alt={book.title}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = 'https://placehold.co/300x450?text=Book'
        }}
        className="w-full h-full object-cover"
        style={{ aspectRatio: '300 / 450' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-40 group-hover:opacity-30 transition-all"></div>
      <div className="absolute bottom-4 left-4 right-4 text-white group-hover:text-opacity-100 opacity-80 transition-all">
        <h3 className="font-semibold text-xl">{book.title}</h3>
      </div>

      {showAddToCollectionButton && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCollection?.(book.id)
          }}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 z-10 flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>Tambah</span>
        </button>
      )}
    </div>
  )
}
