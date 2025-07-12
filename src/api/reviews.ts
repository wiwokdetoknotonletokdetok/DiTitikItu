import type { ReviewResponseDTO } from '@/dto/ReviewResponseDTO'
import type { ReviewRequestDTO } from '@/dto/ReviewRequestDTO'
import type { WebResponse } from '@/dto/WebResponse'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchReviews(bookId: string): Promise<ReviewResponseDTO[]> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`)
  if (!res.ok) throw new Error('Gagal fetch review')
  const json: WebResponse<ReviewResponseDTO[]> = await res.json()
  return json.data
}

export async function postReview(bookId: string, review: ReviewRequestDTO): Promise<void> {
  const token = localStorage.getItem('token')
  console.log('Token:', token)
  const res = await fetch(`${BASE_URL}/books/${bookId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(review)
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Gagal kirim review: ${res.status} - ${errText}`)
  }
}
