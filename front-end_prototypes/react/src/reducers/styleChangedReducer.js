// styleChangedReducer.js

import * as actionType from '../actions/ActionType';

const defaultBaseColor = {
  baseColor: 235
}

const styleChangedReducer = function(state = defaultBaseColor, action) {
  switch (action.type) {
    case actionType.LAYOUT_STYLE_CHANGED:
      {
        let newState = { baseColor: 235 }
        if (action.payload === true) {
          newState = { baseColor: 66 }
        }
        else if (action.payload === false) {
          newState = { baseColor: 235 }
        }
        return newState;
      }
    default:
      return state;
  }
  return state;
}

export default styleChangedReducer;
