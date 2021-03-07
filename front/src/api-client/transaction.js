// own
import config from '../utils/config';

export async function fetchAll(token, page, size) {
  const offset = page * size;
  try {
    const res = await fetch(`${config.API_HOST}/transactions?limit=${size}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    throw Error('Error during transactions fetch.');
  }
}

export async function create(token, data) {
  try {
    const res = await fetch(`${config.API_HOST}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    // result.tags = result.tags.map((tag) => {

    // });
    return (result);
  } catch (err) {
    throw Error('Error during transaction creation.');
  }
}
