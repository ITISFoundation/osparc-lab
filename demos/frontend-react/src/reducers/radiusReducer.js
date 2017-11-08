// radiusReducer.js

import * as actionType from '../actions/ActionType';

const radiusReducer = function(state = 1, action) {
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
