import { isErrorCode } from 'utils/utilities';
// own
import config from '../utils/config';

export async function createLink(token, accountId, institutionId) {
  try {
    const res = await fetch(`${config.API_HOST}/nordigen/create-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId,
        institutionId
      }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during link creation.');
  }
}

export async function retrieveAccountList(token, accountId, nordigenToken, requisitionId) {
  try {
    const res = await fetch(`${config.API_HOST}/nordigen/retrieve-account-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId,
        requisitionId,
        token: nordigenToken
      }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during accounts\' retrieval.');
  }
}

export async function retrieveAccountDetails(token, accountId, nordigenToken, nordigenAccountId, includeTransactions) {
  try {
    const res = await fetch(`${config.API_HOST}/nordigen/retrieve-account-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId,
        nordigenAccountId,
        token: nordigenToken,
        includeTransactions
      }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during accounts\' retrieval.');
  }
}
