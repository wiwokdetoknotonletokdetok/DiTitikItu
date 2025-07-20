import type { SimpleUserResponse } from '@/dto/SimpleUserResponse'
import type { WebResponse } from '@/dto/WebResponse'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getUserFollowings(
  token: string,
  userId: string,
  page: number,
  size: number = 10
): Promise<WebResponse<SimpleUserResponse[]>> {
  const res = await fetch(`${BASE_URL}/users/${userId}/followings?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error('Gagal memuat followings')

  const json: WebResponse<SimpleUserResponse[]> = await res.json()
  return json
}
