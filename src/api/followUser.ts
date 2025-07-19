import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function followUser(userId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}

export async function unfollowUser(userId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
