import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as accountApi from '../api-client/account';

export const fetchAll = createAsyncAction('ACCOUNTS', async (token) => {
  const res = await accountApi.fetchAll(token);
  return res;
});
