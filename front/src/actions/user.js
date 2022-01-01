import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as userApi from '../api-client/user';
import types from './types';

export const getAuth = createAsyncAction('AUTH', async (email, password) => {
  const res = await userApi.login(email, password);
  return res;
});

export const resetState = () => ({
  type: types.USER_RESET_STATE,
});

export const settingsDialogOpen = () => ({
  type: types.USER_SETTINGS_DIALOG_OPEN,
});

export const settingsDialogClose = () => ({
  type: types.USER_SETTINGS_DIALOG_CLOSE,
});

export const updateUser = createAsyncAction('UPDATE', async (token, userId, { name, theme, lang, email  }) => {
  const res = await userApi.updateUser(token, userId, { name, theme, lang, email  });
  return res;
});