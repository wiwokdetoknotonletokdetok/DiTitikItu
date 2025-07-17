import type { LoginUserRequest } from '@/dto/LoginUserRequest.ts'
import type { LoginUserResponse } from '@/dto/LoginUserResponse.ts'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function loginUser(loginUserRequest: LoginUserRequest): Promise<WebResponse<LoginUserResponse>> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginUserRequest)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
