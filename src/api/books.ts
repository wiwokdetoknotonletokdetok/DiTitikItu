import type { WebResponse } from '@/dto/WebResponse'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'
import type { BookRequestDTO } from '@/dto/BookRequestDTO'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchBooks(
  title?: string,
  isbn?: string,
  author?: string,
  genre?: string,
  publisher?: string
): Promise<BookSummaryDTO[]> {
  
  const params = new URLSearchParams()

  if (title) params.append('title', title)
  if (isbn) params.append('isbn', isbn)
  if (author) params.append('author', author)
  if (genre) params.append('genre', genre)
  if (publisher) params.append('publisher', publisher)

  const res = await fetch(`${BASE_URL}/books?${params.toString()}`)

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
    const errText = await res.text()
    throw new Error(`Gagal fetch detail buku: ${res.status} - ${errText}`)
  }

  const json: WebResponse<BookResponseDTO> = await res.json()
  return json.data
}

export async function createBook(data: BookRequestDTO): Promise<WebResponse<string>> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.errors || 'Gagal membuat buku')
  }

  return res.json()
}