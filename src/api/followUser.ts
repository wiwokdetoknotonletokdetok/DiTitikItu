import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function followUser(userId: string, token: string | null): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}

export async function unfollowUser(userId: string, token: string | null): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}

export async function getUsersIdFollowStatus(userId: string, token: string | null): Promise<WebResponse<boolean>> {
  const res = await fetch(`${BASE_URL}/users/${userId}/follow/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
