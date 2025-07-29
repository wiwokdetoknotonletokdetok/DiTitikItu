import { SET_NEW_MARKER_POSITION, RESET_NEW_MARKER_POSITION } from '@/store/actions/newMarkerPositionActions'
import type { MarkerPosition } from '@/dto/MarkerPosition.ts'

const initialState: MarkerPosition | null = null

const newMarkerPositionReducer = (state = initialState, action: any): MarkerPosition | null => {
  switch (action.type) {
    case SET_NEW_MARKER_POSITION:
      return action.payload
    case RESET_NEW_MARKER_POSITION:
      return null
    default:
      return state
  }
}

export default newMarkerPositionReducer
