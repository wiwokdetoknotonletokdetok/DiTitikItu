import { Locate } from 'lucide-react'

interface LocateMeButtonProps {
  onClick: () => void
}

export default function LocateMeButton({ onClick }: LocateMeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute text-gray-500 bottom-28 right-2.5 z-[1000] p-2 bg-white hover:bg-gray-100 border border-gray-200 shadow-md rounded cursor-pointer"
    >
      <Locate size={20}/>
    </button>
  )
}