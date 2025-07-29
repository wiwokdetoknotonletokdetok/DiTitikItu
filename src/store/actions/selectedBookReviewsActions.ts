import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO.ts'

export const SET_SELECTED_BOOK_REVIEWS = 'SET_SELECTED_BOOK_REVIEWS'
export const RESET_SELECTED_BOOK_REVIEWS = 'RESET_SELECTED_BOOK_REVIEWS'

export const setSelectedBookReviews = (reviews: ReviewWithUserDTO[]) => ({
  type: SET_SELECTED_BOOK_REVIEWS,
  payload: reviews,
})

export const resetSelectedBookReviews = () => ({
  type: RESET_SELECTED_BOOK_REVIEWS,
})
