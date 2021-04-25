import dayjs from 'dayjs';

export function mod97(string) {
  let checksum = string.slice(0, 2);
  let fragment;
  for (let offset = 2; offset < string.length; offset += 7) {
    fragment = String(checksum) + string.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
}

/*
* Returns 1 if the IBAN is valid
* Returns FALSE if the IBAN's length is not as should be (for CY the IBAN Should be 28 chars long starting with CY )
* Returns any other number (checksum) when the IBAN is invalid (check digits do not match)
*/
export function isValidIBANNumber(input) {
  const CODE_LENGTHS = {
    // eslint-disable-next-line
    AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26, AL: 28, BY: 28, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25, SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20,
  };
  const iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''); // keep only alphanumeric characters
  // match and capture (1) the country code, (2) the check digits, and (3) the rest
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) => (letter.charCodeAt(0) - 55));
  // final check
  return mod97(digits);
}

export function mimeTypeExtension(mime) {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'application/pdf':
      return 'pdf';
    default:
      return 'data';
  }
}

export function isImage(mime) {
  switch (mime) {
    case 'image/jpeg':
      return true;
    case 'image/png':
      return true;
    default:
      return false;
  }
}

/**
 * Transforms an expression like "n+1" into a function which apply it over a number as parameter.
 * @param {string} expression
 * @return {function}
 */
export function formatExpression(expression) {
  if (!expression) return null;
  const tokens = expression.match(/n([+\-*/])(\d*)/);
  if (!tokens) return null;
  const op = tokens[1];
  const number = parseInt(tokens[2], 10);
  if (op === '+') {
    return (n) => n + number;
  }
  if (op === '-') {
    return (n) => n - number;
  }
  if (op === '*') {
    return (n) => n * number;
  }
  if (op === '/') {
    return (n) => n / number;
  }
  return (n) => (n);
}

/**
 * Calculates array with all saving amounts and dates from startDate to endDate or until targetAmount is reached.
 * @param {number} initialSavedAmount
 * @param {number} targetAmount
 * @param {string} startDate - YYYY/MM/DD
 * @param {string} endDate - YYYY/MM/DD
 * @param {string} freq
 * @param {string} funcExpression
 * @param {Array<Object>}
 */
export function calculateSavingSeries(
  initialSavedAmount, targetAmount, startDate, endDate, freq = '1w', funcExpression = 'n+1',
) {
  if (!initialSavedAmount || !targetAmount || !freq || !funcExpression) return [];
  const res = [];
  const tokens = freq.match(/(\d*)([wdM])/);
  if (!tokens) return [];
  const number = parseFloat(tokens[1]);
  const symbol = tokens[2];
  const expression = formatExpression(funcExpression);
  if (!expression) return [];
  let currentDate = dayjs(startDate);
  let currentAmount = initialSavedAmount;
  let currentSavings = 0;
  while (currentDate.isBefore(dayjs(endDate)) && currentSavings < targetAmount) {
    currentSavings += currentAmount;
    res.push({
      date: currentDate.format('YYYY/MM/DD'),
      amount: currentAmount,
      savings: currentSavings,
    });
    currentDate = currentDate.add(number, symbol);
    currentAmount = expression(currentAmount);
  }
  console.log(res);
  return res;
}
