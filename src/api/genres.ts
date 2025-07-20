import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getGenres(): Promise<{ id: number, name: string }[]> {
  const res = await fetch(`${BASE_URL}/genres`)
  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
  return await res.json()
}
