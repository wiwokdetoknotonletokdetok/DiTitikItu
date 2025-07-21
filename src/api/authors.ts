import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getAuthors(query: string): Promise<WebResponse<string[]>>  {
  const res = await fetch(`${BASE_URL}/authors?q=${encodeURIComponent(query)}&limit=5`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return await res.json()
}
