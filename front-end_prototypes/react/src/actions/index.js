// index.js

import * as actionType from './ActionType';

export function radiusChanged(new_radius) {
  return {
    type: actionType.RADIUS_CHANGED,
    payload: new_radius
  }
}

export function selectedServiceChanged(new_service) {
  return {
    type: actionType.SELECTED_SERVICE_CHANGED,
    payload: new_service
  }
}

export function computeServiceOutput(service) {
  return {
    type: actionType.COMPUTE_OUTPUT_DATA,
    payload: service
  }
}

export function styleChanged(newStyleCode) {
  // 0: day, 1: night, 2: italia
  return {
    type: actionType.LAYOUT_STYLE_CHANGED,
    payload: newStyleCode
  }
}
