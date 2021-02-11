import get from 'lodash.get';

// own
import config from '../utils/config';
import { CustomError } from '../utils/utilities';

export async function fetchAll(token, page, size) {
  const offset = page * size;
  try {
    const res = await fetch(`${config.API_HOST}/transactions?limit=${size}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    throw Error('Error during transactions fetch.');
  }
};
