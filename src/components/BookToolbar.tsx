import LiveSearch from '@/components/LiveSearch.tsx'
import { Link } from 'react-router-dom'
import Tooltip from '@/components/Tooltip.tsx'
import { BookPlus } from 'lucide-react'

interface BookToolbarProps {
  onSelectBook: (bookId: string) => void
}

export default function BookToolbar({ onSelectBook }: BookToolbarProps) {
  return (
    <div className="absolute z-[1000] top-2.5 left-2.5 max-w-md w-full">
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <LiveSearch onSelectBook={onSelectBook}/>
        </div>
        <Link to="/books/new">
          <Tooltip message="Tambah buku baru">
            <button
              className="w-[46px] h-[46px] rounded-full text-gray-500 bg-white border border-gray-300 shadow-md flex items-center justify-center"
              aria-label="Tambah buku"
            >
              <BookPlus size={20}/>
            </button>
          </Tooltip>
        </Link>
      </div>
    </div>
  )
}
