import types from '../actions/types';

const initialState = {
  success: undefined,
  error: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.MESSAGES_SHOW_SUCCESS_MSG:
      return {
        ...state,
        success: action.payload,
      };
    case types.MESSAGES_SHOW_ERROR_MSG:
      return {
        ...state,
        error: action.payload,
      };
    case types.MESSAGES_HIDE_ALL:
      return {
        ...state,
        success: undefined,
        error: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
