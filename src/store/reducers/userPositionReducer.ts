import { SET_USER_POSITION } from '@/store/actions/userPositionActions'
import type { UserPosition } from '@/dto/UserPosition.ts'

const initialState = {
  latitude: 0.0,
  longitude: 0.0,
  gps: false,
  zoom: 12
}

const userPositionReducer = (state = initialState, action: any): UserPosition => {
  switch (action.type) {
    case SET_USER_POSITION:
      return action.payload
    default:
      return state
  }
}

export default userPositionReducer
