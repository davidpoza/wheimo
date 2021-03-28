import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as accountApi from '../api-client/account';
import types from './types';

export const fetchAll = createAsyncAction('ACCOUNTS', async (token) => {
  const res = await accountApi.fetchAll(token);
  return res;
});

export const create = createAsyncAction('CREATE_ACCOUNTS', async (token, data) => {
  const res = await accountApi.create(token, data);
  return res;
});

export const update = createAsyncAction('UPDATE_ACCOUNT', async (token, id, index, data) => {
  const res = await accountApi.update(token, id, data);
  res.index = index;
  return res;
});

export const remove = createAsyncAction('DELETE_ACCOUNT', async (token, id, index) => {
  await accountApi.remove(token, id);
  return (index);
});

export const editDialogOpen = () => ({
  type: types.TAGS_EDIT_DIALOG_OPEN,
});

export const editDialogClose = () => ({
  type: types.TAGS_EDIT_DIALOG_CLOSE,
});
