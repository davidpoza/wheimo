import { isErrorCode } from 'utils/utilities';
// own
import config from '../utils/config';

// export async function auth(token) {
//   try {
//     const res = await fetch(`${config.API_HOST}/accounts`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const result = await res.json();
//     if (isErrorCode(res.status)) throw new Error(result?.message);
//     return result;
//   } catch (err) {
//     throw Error('Error during accounts fetch.');
//   }
// }

export async function auth(secretId, secretKey) {
  try {
    const res = await fetch(`${config.NORDIGEN_API_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret_id: secretId,
        secret_key: secretKey
      }),
    });
    const result = await res.json();
    if (isErrorCode(res.status)) throw new Error(result?.message);
    return (result);
  } catch (err) {
    throw Error('Error during account creation.');
  }
}

// export async function update(token, id, data) {
//   try {
//     const res = await fetch(`${config.API_HOST}/accounts/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });
//     const result = await res.json();
//     if (isErrorCode(res.status)) throw new Error(result?.message);
//     return (result);
//   } catch (err) {
//     throw Error('Error during account update.');
//   }
// }

// export async function remove(token, id) {
//   try {
//     const res = await fetch(`${config.API_HOST}/accounts/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (isErrorCode(res.status)) throw new Error();
//     return (id);
//   } catch (err) {
//     throw Error('Error during account deletion.');
//   }
// }
