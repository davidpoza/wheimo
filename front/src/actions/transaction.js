import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';

export const fetchAll = createAsyncAction('TRANSACTIONS', async (token, page, size) => {
  const res = await transactionApi.fetchAll(token, page, size);
  return res;
});

export const create = createAsyncAction('CREATE_TRANSACTION', async (token, data) => {
  const res = await transactionApi.create(token, data);
  return res;
});
