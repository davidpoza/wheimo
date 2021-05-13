import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as tagApi from '../api-client/tag';
import types from './types';

export const fetchAll = createAsyncAction('TAGS', async (token) => {
  const res = await tagApi.fetchAll(token);
  return res;
});

export const create = createAsyncAction('CREATE_TAGS', async (token, data) => {
  const res = await tagApi.create(token, data);
  return res;
});

export const update = createAsyncAction('UPDATE_TAG', async (token, id, index, data) => {
  const res = await tagApi.update(token, id, data);
  res.index = index;
  return res;
});

export const remove = createAsyncAction('DELETE_TAG', async (token, id, index) => {
  await tagApi.remove(token, id);
  return (index);
});

export const editDialogOpen = () => ({
  type: types.TAGS_EDIT_DIALOG_OPEN,
});

export const editDialogClose = () => ({
  type: types.TAGS_EDIT_DIALOG_CLOSE,
});
