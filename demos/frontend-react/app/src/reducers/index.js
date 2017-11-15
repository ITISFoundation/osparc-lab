// index.js

import { combineReducers } from 'redux'
import radiusReducer from './radiusReducer'
import styleChangedReducer from './styleChangedReducer'
import workbenchServiceReducer from './workbenchServiceReducer'
import computeOutputDataReducer from './computeOutputDataReducer'

export default combineReducers({
  radiusReducer,
  styleChangedReducer,
  workbenchServiceReducer,
  computeOutputDataReducer
})
