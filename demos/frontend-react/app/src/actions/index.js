// index.js

import * as actionType from './ActionType';

export function radiusChanged(newRadius) {
  return {
    type: actionType.RADIUS_CHANGED,
    payload: newRadius
  }
}

export function newServiceRequested(newService) {
  return {
    type: actionType.NEW_SERVICE_REQUESTED,
    payload: newService
  }
}

export function selectedServiceChanged(selService) {
  return {
    type: actionType.SELECTED_SERVICE_CHANGED,
    payload: selService
  }
}

export function computeOutputData(service) {
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
