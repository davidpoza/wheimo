import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as tagApi from '../api-client/tag';

export const fetchAll = createAsyncAction('TAGSACCOUNTS', async (token) => {
  const res = await tagApi.fetchAll(token);
  return res;
});
