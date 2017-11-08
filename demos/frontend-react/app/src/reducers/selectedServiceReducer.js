// selectedServiceReducer.js

import * as actionType from '../actions/ActionType';

const selectedServiceReducer = function(state = [], action) {
  let newState = []
  switch (action.type) {
    case actionType.SELECTED_SERVICE_CHANGED:
      newState.push(action.payload);
      break;
    default:
      return state;
  }
  return newState;
}

export default selectedServiceReducer;
