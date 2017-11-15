// newServiceReducer.js

import * as actionType from '../actions/ActionType';
import initialState from './initialState';

function copyObject(srcObj) {
  var trgObj = JSON.parse(JSON.stringify(srcObj));
  return trgObj;
}

const newServiceReducer = function(state = initialState.workbench, action) {
  let newState = copyObject(state);

  if (action.type === actionType.NEW_SERVICE_REQUESTED) {
    let copiedService = copyObject(action.payload);
    let newNode = {
      uniqueName: copiedService.text + '_S' + Number(newState.nodes.length+1),
      service: copiedService
    };
    if ('input' in copiedService && copiedService.input !== 'none') {
      newNode['input'] = {
        nameId: 'in'
      };
    }

    if ('output' in copiedService && copiedService.output !== 'none') {
      newNode['output'] = {
        nameId: 'out'
      };
    }
    newState.nodes.push(newNode);

    if (newState.selected.length > 0 && newState.selected[0]) {
      let newConn = {
        nameId: 'Conn_' + (state.connections.length + 1),
        input: {
          node: newState.selected[0].uniqueName,
          port: 'out'
        },
        output: {
          node: newNode.uniqueName,
          port: 'in'
        }
      };
      newState.connections.push(newConn);
    }

    newState.selected = [];
    newState.selected.push(newNode);
  }

  if (action.type === actionType.SELECTED_SERVICE_CHANGED) {
    newState.selected = [];
    newState.selected.push(action.payload);
  }

  state = newState;
  return state;
}

export default newServiceReducer;
