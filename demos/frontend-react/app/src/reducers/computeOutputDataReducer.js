// radiusReducer.js

import * as actionType from '../actions/ActionType';

const computeOutputDataReducer = function(compute_this = null, action) {
  switch (action.type) {
    case actionType.COMPUTE_OUTPUT_DATA:
      return action.payload;
    default:
      return null;
  }
}

export default computeOutputDataReducer;
