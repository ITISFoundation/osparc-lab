import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import allReducers from './reducers';

const middleware = applyMiddleware(thunk, createLogger());
export default createStore(allReducers, middleware);
