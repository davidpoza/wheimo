// own
import config from '../utils/config';

export async function fetchAll(token) {
  try {
    const res = await fetch(`${config.API_HOST}/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    return result;
  } catch (err) {
    throw Error('Error during accounts fetch.');
  }
}

export async function create(token, data) {
  try {
    const res = await fetch(`${config.API_HOST}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    return (result);
  } catch (err) {
    throw Error('Error during account creation.');
  }
}

export async function update(token, id, data) {
  try {
    const res = await fetch(`${config.API_HOST}/accounts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    return (result);
  } catch (err) {
    throw Error('Error during account update.');
  }
}

export async function remove(token, id) {
  try {
    await fetch(`${config.API_HOST}/accounts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return (id);
  } catch (err) {
    throw Error('Error during account deletion.');
  }
}
