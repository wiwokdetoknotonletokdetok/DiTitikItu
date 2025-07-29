import type { BookResponseDTO } from '@/dto/BookResponseDTO.ts'

export const SET_SELECTED_BOOK = 'SET_SELECTED_BOOK'
export const RESET_SELECTED_BOOK = 'RESET_SELECTED_BOOK'

export const setSelectedBook = (book: BookResponseDTO) => ({
  type: SET_SELECTED_BOOK,
  payload: book,
})

export const resetSelectedBook = () => ({
  type: RESET_SELECTED_BOOK,
})
