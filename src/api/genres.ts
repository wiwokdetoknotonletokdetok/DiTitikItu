import type { WebResponse } from '@/dto/WebResponse'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

export async function getGenres(): Promise<{ id: number, name: string }[]> {
  const res = await fetch('/genres')
  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
  return await res.json()
}
