//
import { isErrorCode } from 'utils/utilities';
import config from '../utils/config';

export async function fetchAll(token) {
  try {
    const res = await fetch(`${config.API_HOST}/tags`, {
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
    throw Error('Error during tags fetch.');
  }
}

export async function create(token, data) {
  try {
    const res = await fetch(`${config.API_HOST}/tags`, {
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
    throw Error('Error during tag creation.');
  }
}

export async function update(token, id, data) {
  try {
    const res = await fetch(`${config.API_HOST}/tags/${id}`, {
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
    throw Error('Error during tag update.');
  }
}

export async function remove(token, id) {
  try {
    const res = await fetch(`${config.API_HOST}/tags/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (id);
  } catch (err) {
    throw Error('Error during tag deletion.');
  }
}

export async function applyTag(token, tagId) {
  try {
    const res = await fetch(`${config.API_HOST}/tags/${tagId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('Error during tag application.');
  }
}

export async function untag(token, tagId) {
  try {
    const res = await fetch(`${config.API_HOST}/tags/${tagId}/untag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('Error during untagging operation.');
  }
}