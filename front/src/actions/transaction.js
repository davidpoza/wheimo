import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';
import types from './types';

export const fetchAll = createAsyncAction('TRANSACTIONS', async (token, {
  offset, limit, from, to, accountId, tags,
}) => {
  const res = await transactionApi.fetchAll(token, {
    offset, limit, from, to, accountId, tags,
  });
  return res;
});

export const create = createAsyncAction('CREATE_TRANSACTION', async (token, data) => {
  const res = await transactionApi.create(token, data);
  return res;
});

export const update = createAsyncAction('UPDATE_TRANSACTION', async (token, id, index, data) => {
  const res = await transactionApi.update(token, id, data);
  res.index = index;
  return res;
});

export const remove = createAsyncAction('DELETE_TRANSACTION', async (token, id, index) => {
  await transactionApi.remove(token, id);
  return (index);
});

export const contextMenuChangeIndex = (index) => ({
  type: types.TRANSACTIONS_CONTEXT_MENU_CHANGE_INDEX,
  payload: index,
});

export const contextMenuChangeId = (id) => ({
  type: types.TRANSACTIONS_CONTEXT_MENU_CHANGE_ID,
  payload: id,
});

export const contextMenuChangePosition = (x, y) => ({
  type: types.TRANSACTIONS_CONTEXT_MENU_CHANGE_POSITION,
  payload: { x, y },
});

export const createEditDialogOpen = () => ({
  type: types.TRANSACTIONS_CREATE_EDIT_DIALOG_OPEN,
});

export const createEditDialogClose = () => ({
  type: types.TRANSACTIONS_CREATE_EDIT_DIALOG_CLOSE,
});
