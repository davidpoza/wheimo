import { getAuth } from '../actions/user';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  current: null,
  error: false,
  errorMessage: undefined,
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case String(getAuth.pending):
      return {
        ...state,
        isLoading: true,
        current: null,
        error: false,
        errorMessage: undefined,
      };
    case String(getAuth.fulfilled):
      return {
        ...state,
        isLoading: false,
        current: action.payload,
        error: false
      };
    case String(getAuth.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case types.USER_RESET_STATE:
      return initialState;
    default:
      return state;
  }
}

export default reducer;
