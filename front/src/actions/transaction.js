import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';
import types from './types';

export const fetchAll = createAsyncAction('TRANSACTIONS', async (token, {
  offset, limit, from, to, accountId, tags, sort, search,
}) => {
  const res = await transactionApi.fetchAll(token, {
    offset, limit, from, to, accountId, tags, sort, search,
  });
  return res;
});

export const create = createAsyncAction('CREATE_TRANSACTION', async (token, data) => {
  let res = await transactionApi.create(token, data);
  await transactionApi.applyTags(token, res.id);
  res = await transactionApi.fetchOne(token, res.id); // after applying tags we need refetch entity
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

export const fetchExpensesByTag = createAsyncAction('TRANSACTIONS_EXPENSES_BY_TAG', async (token, {
  from, to, accountId,
}) => {
  const res = await transactionApi.fetchExpensesByTag(token, {
    from, to, accountId,
  });
  return res;
});

export const createEditDialogOpen = () => ({
  type: types.TRANSACTIONS_CREATE_EDIT_DIALOG_OPEN,
});

export const createEditDialogClose = () => ({
  type: types.TRANSACTIONS_CREATE_EDIT_DIALOG_CLOSE,
});

export const toggleChecked = (index) => ({
  type: types.TRANSACTIONS_TOGGLE_CHECKBOX,
  payload: index,
});

export const detailsDialogOpen = () => ({
  type: types.TRANSACTIONS_DETAILS_DIALOG_OPEN,
});

export const detailsDialogClose = () => ({
  type: types.TRANSACTIONS_DETAILS_DIALOG_CLOSE,
});

export const toggleCharts = () => ({
  type: types.TRANSACTIONS_TOGGLE_CHARTS,
});

export const setPage = (page) => ({
  type: types.TRANSACTIONS_SET_PAGE,
  payload: page,
});

export const addAttachment = createAsyncAction('TRANSACTIONS_ADD_ATTACHMENT', async (token, {
  transactonId, description, attachment,
}) => {
  const res = await transactionApi.addAttachment(token, {
    transactonId, description, attachment,
  });
  return res;
});
