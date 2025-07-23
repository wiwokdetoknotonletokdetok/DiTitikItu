import type { WebResponse } from "@/dto/WebResponse"
import { ApiError } from "@/exception/ApiError"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function uploadProfilePicture(file: File, token: string | null): Promise<void> {
  const formData = new FormData()
  formData.append("profilePicture", file)

  for (let [key, value] of formData.entries()) {
    console.log("FormData field:", key, value);
  }

  const res = await fetch(`${BASE_URL}/users/me/profile-picture`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    },
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}

export async function deleteProfilePicture(token: string | null): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/me/profile-picture`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }
}