import type { WebResponse } from '@/dto/WebResponse'
import type { UserRankingDTO } from '@/dto/UserRankingDTO'
import { ApiError } from '@/exception/ApiError'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchUserRanking(page = 1, size = 10): Promise<WebResponse<UserRankingDTO[]>> {
  const res = await fetch(`${BASE_URL}/rank?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  const json: WebResponse<UserRankingDTO[]> = await res.json()

  if (!res.ok) {
    throw new ApiError(json.errors, res.status, json.errors)
  }

  return json
}
