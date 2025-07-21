import type { WebResponse } from '@/dto/WebResponse.ts'
import { ApiError } from '@/exception/ApiError.ts'
import type { LocationData } from '@/dto/LocationData.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getUserIPLocation(): Promise<WebResponse<LocationData>> {
  const res = await fetch(`${BASE_URL}/locations/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  return res.json()
}