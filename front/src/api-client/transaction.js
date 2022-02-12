// own
import config from '../utils/config';
import { isErrorCode } from 'utils/utilities';

export async function fetchAll(token, {
  offset, limit, from, to, accountId, tags, sort, search, min, max, operationType, isFav, isDraft, hasAttachments
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
    if (min) params.push(`min=${min}`);
    if (max) params.push(`max=${max}`);
    if (operationType) params.push(`operationType=${operationType}`);
    if (isFav) params.push('isFav=1');
    if (isDraft) params.push('isDraft=1');
    if (hasAttachments) params.push('hasAttachments=1');

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
    if (isErrorCode(res.status)) throw new Error(result?.message);
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
    if (isErrorCode(res.status)) throw new Error(result?.message);
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
    if (isErrorCode(res.status)) throw new Error(result?.message);
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
    if (isErrorCode(res.status)) throw new Error(result?.message);
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
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during transaction update.');
  }
}

/**
 * @param {*} token
 * @param {number, array<number>} id
 * @returns
 */
export async function remove(token, ids) {
  try {
    if (Array.isArray(ids)) {
      await fetch(`${config.API_HOST}/transactions?ids=${ids.join(',')}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      await fetch(`${config.API_HOST}/transactions/${ids}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return (ids);
  } catch (err) {
    throw Error('Error during transaction deletion.');
  }
}

export async function applyTags(token, id) {
  try {
    const res = await fetch(`${config.API_HOST}/transactions/${id}/apply-tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (isErrorCode(res.status)) throw new Error();
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
    const res = await fetch(`${config.API_HOST}/attachments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error adding attachment.');
  }
}
