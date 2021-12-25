// own
import config from '../utils/config';

export async function fetchAll(token, {
  from, to
}) {
  try {
    let url = `${config.API_HOST}/heatmaps`;
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);

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
    throw Error('Error during heatmap fetch.');
  }
}
