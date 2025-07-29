import {
  SET_SELECTED_BOOK_REVIEWS,
  RESET_SELECTED_BOOK_REVIEWS
} from '@/store/actions/selectedBookReviewsActions.ts'
import type { ReviewWithUserDTO } from '@/dto/ReviewWithUserDTO.ts'

const initialState: ReviewWithUserDTO[] = []

const selectedBookReviewsReducer = (state = initialState, action: any): ReviewWithUserDTO[] => {
  switch (action.type) {
    case SET_SELECTED_BOOK_REVIEWS:
      return action.payload
    case RESET_SELECTED_BOOK_REVIEWS:
      return []
    default:
      return state
  }
}

export default selectedBookReviewsReducer
