import { getAuth, updateUser } from '../actions/user';
import types from '../actions/types';

const initialState = {
  isLoading: false,
  current: null,
  error: false,
  errorMessage: undefined,
  settingsDialogOpen: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
        error: false,
      };
    case String(getAuth.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case String(updateUser.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
      };
    case String(updateUser.fulfilled):
      return {
        ...state,
        isLoading: false,
        current: {
          ...action.payload,
          token: state.current.token
        },
        error: false,
      };
    case String(updateUser.rejected):
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: action.payload.message,
      };
    case types.USER_RESET_STATE:
      return initialState;
    case types.USER_SETTINGS_DIALOG_OPEN:
      return {
        ...state,
        settingsDialogOpen: true,
      };
    case types.USER_SETTINGS_DIALOG_CLOSE:
      return {
        ...state,
        settingsDialogOpen: false,
      };
    default:
      return state;
  }
};

export default reducer;
