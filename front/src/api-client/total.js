// own
import config from '../utils/config';

export async function fetchAll(token, {
  from, to, groupBy, tags,
}) {
  try {
    let url = `${config.API_HOST}/totals`;
    const params = [];
    if (from) params.push(`from=${from}`);
    if (to) params.push(`to=${to}`);
    if (groupBy) params.push(`group-by=${groupBy}`);
    if (tags) params.push(`tags=${tags}`);

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

export async function calculateStatistics(token, { from, to }) {
  try {
    let url = `${config.API_HOST}/totals/calculate-statistics`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        from,
        to
      }),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    throw Error('Error during heatmap fetch.');
  }
}
