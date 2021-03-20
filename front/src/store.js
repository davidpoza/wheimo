import { createStore, applyMiddleware, combineReducers } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import StateLoader from './utils/state-loader';

// Reducers
import user from './reducers/user';
import transaction from './reducers/transaction';
import tag from './reducers/tag';
import ui from './reducers/ui';

const stateLoader = new StateLoader();

const enhancer = composeWithDevTools(
  applyMiddleware(promise, thunk),
);

const store = createStore(
  combineReducers({
    user, transaction, tag, ui,
  }),
  stateLoader.loadState(),
  enhancer,
);

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;
