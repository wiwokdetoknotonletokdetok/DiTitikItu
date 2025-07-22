import type { WebResponse } from '@/dto/WebResponse'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchBooks(params: {
  title?: string
  isbn?: string
  author?: string
  genre?: string
  publisher?: string
} = {}): Promise<BookSummaryDTO[]> {
  const searchParams = new URLSearchParams()
  
  for (const [key, value] of Object.entries(params)) {
    if (value) searchParams.append(key, value)
  }

  const res = await fetch(`${BASE_URL}/books?${searchParams.toString()}`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<BookSummaryDTO[]> = await res.json()
  return json.data
}

export async function fetchBookById(id: string): Promise<BookResponseDTO> {
  const res = await fetch(`${BASE_URL}/books/${id}`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<BookResponseDTO> = await res.json()
  return json.data
}

export async function createBook(data: BookRequestDTO): Promise<void> {
  const res = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}

export async function updateBook(id: string, data: BookRequestDTO): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}