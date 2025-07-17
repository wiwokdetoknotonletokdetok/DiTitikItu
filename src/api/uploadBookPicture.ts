import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function uploadBookPicture(bookId: string, file: File): Promise<void> {
  const formData = new FormData()
  formData.append("bookPicture", file)

  const res = await fetch(`${BASE_URL}/books/${bookId}/book-picture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`
    },
    body: formData,
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}