import type { UserPosition } from '@/dto/UserPosition.ts'

export const SET_USER_POSITION = 'SET_USER_POSITION'

export const setUserPosition = (userPosition: UserPosition) => ({
  type: SET_USER_POSITION,
  payload: userPosition,
})
