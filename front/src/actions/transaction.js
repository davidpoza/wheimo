import { createAsyncAction } from 'redux-promise-middleware-actions';
import * as transactionApi from '../api-client/transaction';

export const fetchAll = createAsyncAction('TRANSACTIONS', async (token, {
  offset, limit, from, to, accountId,
}) => {
  const res = await transactionApi.fetchAll(token, {
    offset, limit, from, to, accountId,
  });
  return res;
});

export const create = createAsyncAction('CREATE_TRANSACTION', async (token, data) => {
  const res = await transactionApi.create(token, data);
  return res;
});
