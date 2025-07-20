import axios from 'axios'
import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookLocationResponse } from '@/dto/BookLocationResponse.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getBooksIdLocations(
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
