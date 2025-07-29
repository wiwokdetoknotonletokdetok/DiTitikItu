import type { MarkerPosition } from '@/dto/MarkerPosition.ts'

export const SET_FLY_TO_LOCATION = 'SET_FLY_TO_LOCATION'
export const RESET_FLY_TO_LOCATION = 'RESET_FLY_TO_LOCATION'

export interface MarkerWithZoom extends MarkerPosition {
  zoom: number
}

export const setFlyToLocation = (markerWithZoom: MarkerWithZoom) => ({
  type: SET_FLY_TO_LOCATION,
  payload: markerWithZoom,
})

export const resetNewMarkerPosition = () => ({
  type: RESET_FLY_TO_LOCATION,
})
