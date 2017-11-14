// styleChangedReducer.js

import * as actionType from '../actions/ActionType';
import initialState from './initialState';

const styleChangedReducer = function(state = initialState.defaultBaseColor, action) {
  switch (action.type) {
    case actionType.LAYOUT_STYLE_CHANGED:
      {
        let newState = { baseColor: 235 }
        if (Number(action.payload) === 1) {
          newState = { baseColor: 66 }
        }
        else if (Number(action.payload) === 0) {
          newState = { baseColor: 235 }
        }
        return newState;
      }
    default:
      return state;
  }
}

export default styleChangedReducer;
