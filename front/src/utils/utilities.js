import dayjs from 'dayjs';

export function isMobileDevice() {
  return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
  }
}

export function azOrder(a, b) {
  if (a.name.toUpperCase() < b.name.toUpperCase()) {
    return -1;
  }
  if (a.name.toUpperCase() > b.name.toUpperCase()) {
    return 1;
  }
  return 0;
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
  return res;
}
