import { InfiniteList } from '@/components/InfiniteList'
import type { SimpleUserResponse } from '@/dto/SimpleUserResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { Link } from 'react-router-dom'

type SimpleUserListProps = {
  userId: string
  token: string
  api: (
    token: string,
    userId: string,
    page: number,
    size?: number
  ) => Promise<WebResponse<SimpleUserResponse[]>>
}

export default function SimpleUserList({ token, userId, api } : SimpleUserListProps) {
  const fetchFn = (page: number) => api(token, userId, page)

  return (
    <InfiniteList<SimpleUserResponse>
      fetchFn={fetchFn}
      renderItem={(user) => (
        <Link
          to={`/profile/${user.id}`}
          className="flex items-center gap-4"
        >
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <span>{user.name}</span>
        </Link>
      )}
    />
  )
}
