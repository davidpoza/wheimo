import types from './types';

export const showSuccessMessage = (msg) => ({
  type: types.MESSAGES_SHOW_SUCCESS_MSG,
  payload: msg,
});

export const showErrorMessage = (msg) => ({
  type: types.MESSAGES_SHOW_ERROR_MSG,
  payload: msg,
});

export const hideMessages = () => ({
  type: types.MESSAGES_HIDE_ALL,
});

