import { SET_SELECTED_BOOK, RESET_SELECTED_BOOK } from '@/store/actions/selectedBookActions'
import type { BookResponseDTO } from '@/dto/BookResponseDTO'

const initialState: BookResponseDTO | null = null

const selectedBookReducer = (state = initialState, action: any): BookResponseDTO | null => {
  switch (action.type) {
    case SET_SELECTED_BOOK:
      return action.payload
    case RESET_SELECTED_BOOK:
      return null
    default:
      return state
  }
}

export default selectedBookReducer
