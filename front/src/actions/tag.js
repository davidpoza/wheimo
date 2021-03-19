import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as tagApi from '../api-client/tag';

export const fetchAll = createAsyncAction('TAGS', async (token) => {
  const res = await tagApi.fetchAll(token);
  return res;
});

export const create = createAsyncAction('CREATE_TAGS', async (token, data) => {
  const res = await tagApi.create(token, data);
  return res;
});
