import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function logoutUser(token: string): Promise<WebResponse<string>> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
