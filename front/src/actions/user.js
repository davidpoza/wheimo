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