import {
  SET_SELECTED_BOOK_LOCATIONS,
  RESET_SELECTED_BOOK_LOCATIONS
} from '@/store/actions/selectedBookLocationsActions'
import type { BookLocationResponse } from '@/dto/BookLocationResponse'

const initialState: BookLocationResponse[] = []

const selectedBookLocationsReducer = (state = initialState, action: any): BookLocationResponse[] => {
  switch (action.type) {
    case SET_SELECTED_BOOK_LOCATIONS:
      return action.payload
    case RESET_SELECTED_BOOK_LOCATIONS:
      return []
    default:
      return state
  }
}

export default selectedBookLocationsReducer
