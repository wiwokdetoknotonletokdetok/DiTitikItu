import type { BookLocationRequest } from '@/dto/BookLocationRequest'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchBookLocations(bookId: string): Promise<BookLocationResponse[]> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/locations`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    console.error('Error fetching book locations:', data.errors)
    throw new ApiError(data.errors, res.status, data.errors)
  }
  
  const data: WebResponse<BookLocationResponse[]> = await res.json()
  return data.data
}

export async function postBookLocation(bookId: string, location: BookLocationRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(location)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}
