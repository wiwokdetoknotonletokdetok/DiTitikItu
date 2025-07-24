import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookResponseDTO } from '@/dto/BookResponseDTO.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getBooksId(bookId: string, token: string | null): Promise<WebResponse<BookResponseDTO>> {
  const res = await fetch(`${BASE_URL}/books/${bookId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}
