import { type MarkerWithZoom, RESET_FLY_TO_LOCATION, SET_FLY_TO_LOCATION } from '@/store/actions/flyToLocationActions.ts'

const initialState: MarkerWithZoom | null = null

const flyToLocationReducer = (state = initialState, action: any): MarkerWithZoom | null => {
  switch (action.type) {
    case SET_FLY_TO_LOCATION:
      return action.payload
    case RESET_FLY_TO_LOCATION:
      return null
    default:
      return state
  }
}

export default flyToLocationReducer
