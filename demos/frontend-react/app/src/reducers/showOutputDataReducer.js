// radiusReducer.js

import * as actionType from '../actions/ActionType';
import initialState from './initialState';

const showOutputDataReducer = function(compute_this = initialState.showThis, action) {
  switch (action.type) {
    case actionType.SHOW_OUTPUT_DATA:
      return action.payload;
    default:
      return null;
  }
}

export default showOutputDataReducer;
