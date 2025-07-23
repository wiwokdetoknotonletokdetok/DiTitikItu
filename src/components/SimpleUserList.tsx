import { InfiniteList } from '@/components/InfiniteList'
import type { SimpleUserResponse } from '@/dto/SimpleUserResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'

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
  const [users, setUsers] = useState<SimpleUserResponse[]>([])
  const [loading, setLoading] = useState(false)
  const fetchFn = (page: number) => api(token, userId, page)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <InfiniteList<SimpleUserResponse>
      fetchFn={fetchFn}
      setItems={setUsers}
      ref={containerRef}
      loading={loading}
      setLoading={setLoading}
    >
      <div
        ref={containerRef}
        className="h-96 overflow-y-auto"
      >
        <div>
          <ul className="space-y-2">
            {users.map((user, index) => (
              <li key={index}>
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100"
                >
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-medium">{user.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pt-4 flex justify-center">
            {loading && (
              <p className="text-sm text-gray-600">Memuat...</p>
            )}
          </div>
        </div>
      </div>
    </InfiniteList>
  )
}
