import Tooltip from '@/components/Tooltip.tsx'

interface FollowButtonProps {
  followed: boolean
  name: string
  loading?: boolean
  onClick: () => void
}

export default function FollowButton({ followed, name, loading = false, onClick,}: FollowButtonProps) {
  return (
    <Tooltip message={followed ? `Unfollow ${name}` : `Follow ${name}`}>
      <button
        onClick={onClick}
        disabled={loading}
        className={`h-[42px] px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out ${
          followed
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            : 'bg-[#1E497C] text-white hover:bg-[#5C8BC1]'
        } ${loading && !followed ? 'cursor-not-allowed bg-[#5C8BC1]' : ''}
          ${loading && followed ? 'cursor-not-allowed bg-gray-300' : ''}`}
      >
        {loading ? 'Memproses...' : followed ? 'Following' : 'Follow'}
      </button>
    </Tooltip>
  )
}
