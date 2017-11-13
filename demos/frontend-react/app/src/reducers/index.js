// index.js

import { combineReducers } from 'redux'
import radiusReducer from './radiusReducer'
import selectedServiceReducer from './selectedServiceReducer'
import computeOutputDataReducer from './computeOutputDataReducer'
import styleChangedReducer from './styleChangedReducer'

export default combineReducers({
  radiusReducer,
  selectedServiceReducer,
  computeOutputDataReducer,
  styleChangedReducer
})
