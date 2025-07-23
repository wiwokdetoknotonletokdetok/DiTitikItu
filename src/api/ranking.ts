import type { WebResponse } from '@/dto/WebResponse'
import type { UserRankingDTO } from '@/dto/UserRankingDTO'
import { ApiError } from '@/exception/ApiError'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchUserRanking(): Promise<UserRankingDTO[]> {
  const res = await fetch(`${BASE_URL}/rank`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const json: WebResponse<UserRankingDTO[]> = await res.json()
  return json.data
}
