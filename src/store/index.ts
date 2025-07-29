import { combineReducers, createStore } from 'redux'
import userPositionReducer from '@/store/reducers/userPositionReducer'
import selectedBookReducer from '@/store/reducers/selectedBookReducer.ts'
import selectedBookLocationsReducer from '@/store/reducers/selectedBookLocationsReducer.ts'
import selectedBookReviewsReducer from '@/store/reducers/selectedBookReviewsReducer.ts'
import newMarkerPositionReducer from '@/store/reducers/newMarkerPositioneReducer.ts'
import flyToLocationReducer from '@/store/reducers/flyToLocationReducer.ts'

const rootReducer = combineReducers({
  userPosition: userPositionReducer,
  selectedBook: selectedBookReducer,
  selectedBookLocations: selectedBookLocationsReducer,
  selectedBookReviews: selectedBookReviewsReducer,
  newMarkerPosition: newMarkerPositionReducer,
  flyToLocation: flyToLocationReducer
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)
export default store
