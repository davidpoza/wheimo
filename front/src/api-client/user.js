import get from 'lodash.get';

// own
import config from '../utils/config';
import { CustomError } from '../utils/utilities';

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
};
