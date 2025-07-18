import type { ReviewResponseDTO } from '@/dto/ReviewResponseDTO'
import type { ReviewRequestDTO } from '@/dto/ReviewRequestDTO'
import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:8081'

export async function fetchReviews(bookId: string): Promise<ReviewResponseDTO[]> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    console.error('Error fetching reviews:', data.errors)
    throw new ApiError(data.errors, res.status, data.errors)
  }
  
  const json: WebResponse<ReviewResponseDTO[]> = await res.json()
  return json.data
}

export async function postReview(bookId: string, review: ReviewRequestDTO): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(review)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}

export async function deleteReview(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}

export async function updateReview(bookId: string, userId: string, payload: { message: string, rating: number }) {
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}
