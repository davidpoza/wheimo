// own
import config from '../utils/config';

export async function update(token, id, data) {
  try {
    const res = await fetch(`${config.API_HOST}/attachments/${id}`, {
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
    throw Error('Error during attachment update.');
  }
}

export async function remove(token, id) {
  try {
    await fetch(`${config.API_HOST}/attachments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return (id);
  } catch (err) {
    throw Error('Error during attachment deletion.');
  }
}

