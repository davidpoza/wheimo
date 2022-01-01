// own
import config from '../utils/config';
import { isErrorCode } from 'utils/utilities';

export async function login(email, password) {
  try {
    const res = await fetch(`${config.API_HOST}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('login failed due to connection problems.');
  }
}

export async function validateToken(token) {
  try {
    const res = await fetch(`${config.API_HOST}/auth/validate?auth=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('Token is not valid');
  }
}

export async function updateUser(token, userId, { name, theme, lang, email }) {
  try {
    const res = await fetch(`${config.API_HOST}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, theme, lang, email }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return result;
  } catch (err) {
    throw Error('Token is not valid');
  }
}