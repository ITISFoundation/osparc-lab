// radiusReducer.js

import * as actionType from '../actions/ActionType';
import initialState from './initialState';

const radiusReducer = function(state = initialState.radiusValue, action) {
  let newState;
  switch (action.type) {
    case actionType.RADIUS_CHANGED:
      newState = action.payload;
      break;
    default:
      return state;
  }
  return newState;
}

export default radiusReducer;
