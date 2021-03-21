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

export const update = createAsyncAction('UPDATE_TAG', async (token, id, index, data) => {
  console.log(data);
  const res = await tagApi.update(token, id, data);
  res.index = index;
  return res;
});

export const remove = createAsyncAction('DELETE_TAG', async (token, id, index) => {
  await tagApi.remove(token, id);
  return (index);
});
