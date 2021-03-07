// own
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
    return result;
  } catch (err) {
    throw Error('Error during tags fetch.');
  }
}
