import axios from 'axios'
import { ApiError } from '@/exception/ApiError.ts'
import type { BookSummaryDTO } from '@/dto/BookSummaryDTO.ts'
import type {WebResponse} from '@/dto/WebResponse.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getBooksSemantic(query: string, limit = 5, threshold = 0.4): Promise<WebResponse<BookSummaryDTO[]>> {
  try {
    const response = await axios.get<WebResponse<BookSummaryDTO[]>>(
      `${BASE_URL}/books`, {
      params: {
        q: query,
        limit,
        threshold
      },
      headers: {
        Accept: "application/json"
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data as WebResponse<string>
      throw new ApiError(data.errors, error.response.status, data.errors)
    }

    throw new ApiError('Unknown error occurred', 500, 'Unknown error')
  }
}
