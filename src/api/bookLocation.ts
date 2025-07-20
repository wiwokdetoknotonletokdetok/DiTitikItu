import type { BookLocationRequest } from '@/dto/BookLocationRequest'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'
import type { WebResponse } from '@/dto/WebResponse'
import { ApiError } from '@/exception/ApiError.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchBookLocations(bookId: string, latitude: number, longitude: number): Promise<BookLocationResponse[]> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/locations?latitude=${latitude}&longitude=${longitude}`)

  if (!res.ok) {
    const data: WebResponse<string> = await res.json()
    throw new ApiError(data.errors, res.status, data.errors)
  }

  const data: WebResponse<BookLocationResponse[]> = await res.json()
  return data.data
}

export async function postBookLocation(bookId: string, location: BookLocationRequest): Promise<void> {
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

export async function updateBookLocation(bookId: string, locationId: string, location: BookLocationRequest): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/locations/${locationId}`, {
    method: 'PUT',
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

export async function deleteBookLocation(bookId: string, locationId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${bookId}/locations/${locationId}`, {
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