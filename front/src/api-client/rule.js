// own
import { isErrorCode } from 'utils/utilities';
import config from '../utils/config';

export async function fetchAll(token) {
  try {
    const res = await fetch(`${config.API_HOST}/rules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('Error during rules fetch.');
  }
}

export async function create(token, data) {
  try {
    const res = await fetch(`${config.API_HOST}/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during rule creation.');
  }
}

export async function update(token, id, data) {
  try {
    const res = await fetch(`${config.API_HOST}/rules/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during rule update.');
  }
}

export async function remove(token, id) {
  try {
    const res = await fetch(`${config.API_HOST}/rules/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (isErrorCode(res.status)) throw new Error();
    return (id);
  } catch (err) {
    throw Error('Error during rule deletion.');
  }
}
