// own
import config from '../utils/config';

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
    return result;
  } catch (err) {
    throw Error('Token is not valid');
  }
}