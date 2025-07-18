import type {UserProfileResponse} from '@/dto/UserProfileResponse.ts'
import type {WebResponse} from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function userProfile(userId: string): Promise<WebResponse<UserProfileResponse>> {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
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

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  localStorage.removeItem('token')
}