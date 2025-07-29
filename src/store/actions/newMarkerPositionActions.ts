import type { MarkerPosition } from '@/dto/MarkerPosition.ts'

export const SET_NEW_MARKER_POSITION = 'SET_NEW_MARKER_POSITION'
export const RESET_NEW_MARKER_POSITION = 'RESET_NEW_MARKER_POSITION'

export const setNewMarkerPosition = (markerPosition: MarkerPosition) => ({
  type: SET_NEW_MARKER_POSITION,
  payload: markerPosition,
})

export const resetNewMarkerPosition = () => ({
  type: RESET_NEW_MARKER_POSITION,
})
