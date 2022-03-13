import i18n from 'utils/i18n';
import { getAuth, updateUser } from 'actions/user';
import types from 'actions/types';

const initialState = {
  isLoading: false,
  current: null,
  error: false,
  settingsDialogOpen: false,
  errorMessage: undefined,
  successMessage: undefined,
};

const reducer = (state = initialState, action) => {
  const lng = localStorage.getItem('lang');
  switch (action.type) {
    case String(getAuth.pending):
      return {
        ...state,
        isLoading: true,
        current: null,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
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
        errorMessage: i18n.t('errorMessages.updateUser', { lng }),
      };
    case String(updateUser.pending):
      return {
        ...state,
        isLoading: true,
        error: false,
        errorMessage: undefined,
        successMessage: undefined,
      };
    case String(updateUser.fulfilled):
      return {
        ...state,
        isLoading: false,
        current: {
          ...action.payload,
          token: state.current.token
        },
        successMessage: i18n.t('successMessages.updateUser', { lng }),
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
    case types.USER_HIDE_ALL_MSGS:
      return {
        ...state,
        errorMessage: undefined,
        successMessage: undefined,
      };
    default:
      return state;
  }
};

export default reducer;
