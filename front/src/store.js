import { createStore, applyMiddleware, combineReducers } from "redux";
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import StateLoader from './utils/state-loader';

// Reducers
import user from './reducers/user';

const stateLoader = new StateLoader();

const enhancer = composeWithDevTools(
  applyMiddleware(promise, thunk)
);

const store = createStore(
  combineReducers({ user }),
  stateLoader.loadState(),
  enhancer
);

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;