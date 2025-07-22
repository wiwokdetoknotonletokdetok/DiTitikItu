import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { UpdatePasswordRequest } from '@/dto/UpdatePasswordRequest.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function authPassword(updatePasswordRequest: UpdatePasswordRequest, token: string | null): Promise<WebResponse<string>> {
  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatePasswordRequest)
  })

  console.log(token)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
