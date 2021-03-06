// own
import config from '../utils/config';

export async function fetchAll(token, {
  offset, limit, from, to, accountId, tags, sort, search,
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
    if (sort) params.push(`sort=${sort}`);
    if (search) params.push(`search=${search}`);

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

export async function fetchOne(token, id) {
  try {
    const url = `${config.API_HOST}/transactions/${id}`;
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
    throw Error('Error during transaction fetch.');
  }
}

export async function fetchExpensesByTag(token, {
  from, to, accountId,
}) {
  try {
    let url = `${config.API_HOST}/transactions/tags`;
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (accountId) params.push(`accountId=${accountId}`);

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
    throw Error('Error during expenses by tags fetch.');
  }
}

export async function create(token, data) {
  const adaptedData = { ...data };
  adaptedData.tags = data.tags.map((tag) => (tag.id));

  try {
    const res = await fetch(`${config.API_HOST}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adaptedData),
    });
    const result = await res.json();

    return (result);
  } catch (err) {
    throw Error('Error during transaction creation.');
  }
}

export async function update(token, id, data) {
  const adaptedData = { ...data };
  if (data.tags) {
    adaptedData.tags = data.tags.map((tag) => (tag.id));
  }

  try {
    const res = await fetch(`${config.API_HOST}/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adaptedData),
    });
    const result = await res.json();

    return (result);
  } catch (err) {
    throw Error('Error during transaction update.');
  }
}

export async function remove(token, id) {
  try {
    await fetch(`${config.API_HOST}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return (id);
  } catch (err) {
    throw Error('Error during transaction deletion.');
  }
}

export async function applyTags(token, id) {
  try {
    await fetch(`${config.API_HOST}/transactions/${id}/apply-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return (id);
  } catch (err) {
    throw Error('Error during tags application.');
  }
}

/**
 *
 * @param {*} token
 * @param {Object} formData - FormData
 * @returns {Object} - created attachment
 */
export async function addAttachment(token, formData) {
  try {
    const att = await fetch(`${config.API_HOST}/attachments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return (await att.json());
  } catch (err) {
    throw Error('Error adding attachment.');
  }
}
