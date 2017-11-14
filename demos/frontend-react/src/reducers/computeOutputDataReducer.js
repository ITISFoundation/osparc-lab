// radiusReducer.js

import * as actionType from '../actions/ActionType';
import initialState from './initialState';

const computeOutputDataReducer = function(compute_this = initialState.computeThis, action) {
  switch (action.type) {
    case actionType.COMPUTE_OUTPUT_DATA:
      return action.payload;
    default:
      return null;
  }
}

export default computeOutputDataReducer;
