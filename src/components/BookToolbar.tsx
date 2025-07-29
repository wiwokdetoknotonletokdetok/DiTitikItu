import LiveSearch from '@/components/LiveSearch.tsx'
import { useNavigate } from "react-router-dom"
import Tooltip from '@/components/Tooltip.tsx'
import { BookPlus } from 'lucide-react'
import Modal from '@/components/Modal.tsx'
import { useAuth } from '@/context/AuthContext.tsx'
import LoginPromptContent from '@/components/LoginPromptContent.tsx'
import type { RefObject } from 'react'

interface BookToolbarProps {
  searchBarRef: RefObject<HTMLDivElement | null>
  addBookRef: RefObject<HTMLButtonElement | null>
}

export default function BookToolbar({ searchBarRef, addBookRef }: BookToolbarProps) {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  function handleAddBookClick() {
    if (isLoggedIn()) {
      navigate('/books')
    } else {
      navigate('#login-required')
    }
  }

  return (
    <div className="absolute z-[2001] top-2.5 left-2.5 max-w-md w-full">
      <div className="flex items-center space-x-2">
        <div className="flex-1 z-[2001]">
          <LiveSearch onBoardingRef={searchBarRef} />
        </div>
        <Tooltip message="Tambah buku baru">
          <button
            ref={addBookRef}
            onClick={handleAddBookClick}
            className="w-[46px] h-[46px] rounded-full text-gray-500 bg-white border border-gray-300 shadow-md flex items-center justify-center"
            aria-label="Tambah buku"
          >
            <BookPlus size={20}/>
          </button>
        </Tooltip>
      </div>
      <Modal hash="#login-required">
        <h2 className="text-xl font-semibold mb-4">Tambah buku baru</h2>
        <LoginPromptContent/>
      </Modal>
    </div>
  )
}
