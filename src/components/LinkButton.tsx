import { Link } from 'react-router-dom'

interface LinkButtonProps {
  name: string
  to: string
}

export default function LinkButton({ name, to }: LinkButtonProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center h-[42px] px-6 py-2 rounded-full font-semibold bg-[#1E497C] text-white hover:bg-[#5C8BC1]
      transition duration-200 ease-in-out"
    >
      {name}
    </Link>
  )
}
