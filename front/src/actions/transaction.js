import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';

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

export const remove = createAsyncAction('DELETE_TRANSACTION', async (token, id, index) => {
  console.log('action llamada con ', id, index);
  const res = await transactionApi.remove(token, id);
  return ({ response: res, index });
});
