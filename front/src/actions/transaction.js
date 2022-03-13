import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';
import * as attachmentApi from '../api-client/attachment';
import types from './types';

export const fetchAll = createAsyncAction('TRANSACTIONS', async (token, {
  offset, limit, from, to, accountId, tags, sort, search, min, max, operationType, isFav, isDraft, year, hasAttachments
}) => {
  const res = await transactionApi.fetchAll(token, {
    offset, limit, from, to, accountId, tags, sort, search, min, max, operationType, isFav, isDraft, year, hasAttachments,
  });
  return res;
});

// refresh parameter allow us to avoid refreshing redux state, without avoid api call
export const create = createAsyncAction('CREATE_TRANSACTION', async (token, data, refresh) => {
  let res = await transactionApi.create(token, data);
  await transactionApi.applyTags(token, res.id);
  res = await transactionApi.fetchOne(token, res.id); // after applying tags we need refetch entity
  res.refresh = refresh;
  return res;
});

export const update = createAsyncAction('UPDATE_TRANSACTION', async (token, id, index, data) => {
  const res = await transactionApi.update(token, id, data);
  res.index = index;
  return res;
});

export const remove = createAsyncAction('DELETE_TRANSACTION', async (token, ids, indexes) => {
  await transactionApi.remove(token, ids);
  return (indexes);
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

export const mergeDialogOpen = () => ({
  type: types.TRANSACTIONS_MERGE_DIALOG_OPEN,
});

export const mergeDialogClose = () => ({
  type: types.TRANSACTIONS_MERGE_DIALOG_CLOSE,
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

export const addAttachment = createAsyncAction('TRANSACTIONS_ADD_ATTACHMENT', async (token, formData) => {
  const res = await transactionApi.addAttachment(token, formData);
  return { ...res, transactionId: parseInt(formData.get('transactionId'), 10) };
});

export const updatedAttachment = createAsyncAction('TRANSACTIONS_UPDATE_ATTACHMENT',
  async (token, id, data, transactionId) => {
    const res = await attachmentApi.update(token, id, data);
    return { ...res, transactionId };
  });

export const removeAttachment = createAsyncAction('TRANSACTIONS_REMOVE_ATTACHMENT',
  async (token, id, transactionId) => {
    await attachmentApi.remove(token, id);
    return { id, transactionId };
  });

export const hideMessages = () => ({
  type: types.TRANSACTIONS_HIDE_ALL_MSGS,
});

