// own
import config from '../utils/config';

export async function fetchAll(token, {
  offset, limit, from, to, accountId, tags,
}) {
  try {
    let url = `${config.API_HOST}/transactions`;
    const params = [];
    if (offset) params.push(`offset=${offset}`);
    if (limit) params.push(`limit=${limit}`);
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (accountId) params.push(`accountId=${accountId}`);
    if (tags) params.push(`tags=${tags.join(',')}`);

    params.forEach((param, index) => {
      if (index === 0) {
        url += '?';
      } else {
        url += '&';
      }
      url += param;
    });

    const res = await fetch(url, {
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

export async function remove(token, id) {
  try {
    const res = await fetch(`${config.API_HOST}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('res', res);
    const result = await res.json();
    return (result);
  } catch (err) {
    throw Error('Error during transaction deletion.');
  }
}
