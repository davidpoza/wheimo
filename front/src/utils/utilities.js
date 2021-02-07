export function modulus(a, n) {
  return ((a % n ) + n ) % n;
}

export function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

/**
 * @param {number} seconds
 * @returns {string} Returns string looking like 05:33
 */
export function secondsToShortString(seconds) {
  const hour = Math.trunc(seconds / 3600);
  const min = Math.trunc((seconds % 3600) / 60);
  const sec = Math.trunc(seconds % 60);
  if (hour === 0) {
    return (`${min}:${pad(sec, 2)}`);
  }
  return (`${hour}:${pad(min, 2)}:${pad(sec, 2)}`);
}

/**
 * @param {number} seconds
 * @returns {string} Returns string looking like 3 hr 40 min or 43 min 28 sec
 */
export function secondsToLongString(seconds) {
  const hour = Math.trunc(seconds / 3600);
  const min = Math.trunc((seconds % 3600) / 60);
  const sec = Math.trunc(seconds % 60);
  if (hour === 0) {
    return (`${min} min ${sec} seg`);
  }
  return (`${hour} hr ${min} min`);
}

/**
 * Transforms model used in fronend to the backend one
 * @param {Array<Object>} arrSongs
 * @param {Object} albumData
 * @param {string} albumData.name
 * @param {string} albumData.artist
 * @param {string} albumData.cover
 */
export function transformSongs(arrSongs, albumData) {
  return arrSongs.map((e, index) => {
    return ({
      id: e.id,
      number: index + 1,
      name: e.name,
      album: albumData.name,
      artist: albumData.artist,
      seconds: e.duration,
      cover: albumData.cover,
      audio: e.audio,
    });
  });
}

export function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
  }
}

export async function getBlobFromUrl(imageUrl, imageName) {
  const response = await fetch(imageUrl, {
    responseType: 'blob',
  });
  const data = await response.blob();
  const mimeType = response.headers['content-type'];
  const imageFile = new File([data], imageName, { type: mimeType });
  return imageFile;
}