import axios from 'axios'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'
import type {BookLocationRequest} from "@/dto/BookLocationRequest.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function booksIdLocations(
  bookId: string,
  latitude: number,
  longitude: number
): Promise<WebResponse<BookLocationResponse[]>> {
  try {
    const response = await axios.get<WebResponse<BookLocationResponse[]>>(
      `${BASE_URL}/books/${bookId}/locations`,
      {
        headers: {
          'Accept': 'application/json',
        },
        params: {
          latitude,
          longitude,
        },
      }
    )

    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as WebResponse<string>
      throw new ApiError(data.errors, error.response.status, data.errors)
    }

    throw new ApiError('Unknown error occurred', 500, 'Unknown error')
  }
}

export async function postBooksIdLocations(bookId: string, location: BookLocationRequest): Promise<void> {
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
