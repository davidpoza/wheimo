import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as userApi from '../api-client/user';


export const getAuth = createAsyncAction('AUTH', async (email, password) => {
  const res = await userApi.login(email, password);
  return res;
});