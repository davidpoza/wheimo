import { createStore, applyMiddleware, combineReducers } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import StateLoader from 'utils/state-loader';

// Reducers
import account from 'reducers/account';
import tag from 'reducers/tag';
import transaction from 'reducers/transaction';
import ui from 'reducers/ui';
import user from 'reducers/user';
import messages from 'reducers/messages';

const stateLoader = new StateLoader();

const enhancer = composeWithDevTools(
  applyMiddleware(promise, thunk),
);

const store = createStore(
  combineReducers({
    user, transaction, tag, ui, account, messages,
  }),
  stateLoader.loadState(),
  enhancer,
);

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;
