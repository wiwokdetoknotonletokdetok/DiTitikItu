import type { WebResponse } from '@/dto/WebResponse'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = 'http://localhost:8080'

export async function addBookToUser(bookId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/users/me/books/${bookId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({})
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<string> = await res.json()
  return json.data
}

export async function removeBookFromUser(bookId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/users/me/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<string> = await res.json()
  return json.data
}

export async function fetchUserBooks(userId: string): Promise<BookSummaryDTO[]> {
  const res = await fetch(`${BASE_URL}/users/${userId}/books`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<BookSummaryDTO[]> = await res.json()
  return json.data
}

export async function countUserBooks(userId: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/users/${userId}/books/count`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<number> = await res.json()
  return json.data
}
