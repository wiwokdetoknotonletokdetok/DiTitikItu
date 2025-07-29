import type { BookLocationResponse } from '@/dto/BookLocationResponse'

export const SET_SELECTED_BOOK_LOCATIONS = 'SET_SELECTED_BOOK_LOCATIONS'
export const RESET_SELECTED_BOOK_LOCATIONS = 'RESET_SELECTED_BOOK_LOCATIONS'

export const setSelectedBookLocations = (locations: BookLocationResponse[]) => ({
  type: SET_SELECTED_BOOK_LOCATIONS,
  payload: locations,
})

export const resetSelectedBookLocations = () => ({
  type: RESET_SELECTED_BOOK_LOCATIONS,
})
