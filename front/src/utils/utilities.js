import dayjs from 'dayjs';

export function isMobileDevice() {
  let check = false;
  // eslint-disable-next-line
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
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


export function formatAmount(amount, absolute = true) {
  return (absolute ? Math.abs(amount) : amount)?.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
  });
}

export function getInnerHeight(element) {
  const computedStyle = getComputedStyle(element);
  return element.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
}

/**
 * Adapt de given date to the nearest one from posibleDates array. Keeping the same year
 * @param {String} date - as dayjs obj
 * @param {Array<String>} posibleDates array of dates with format DD-MM
 * @returns {Object} dayjs
 */
export function nearestDay(d0, possibleDates = []) {
  const year = parseInt(d0.format('YYYY'), 10);
  let differenceWithSelectedDate = 366;
  let selectedDate;
  possibleDates.forEach((d) => {
    const currDate = dayjs(`${d}-${year}`, 'DD-MM-YYYY');
    const currDiff = Math.abs(d0.diff(currDate, 'days'));
    if (currDiff < differenceWithSelectedDate){
      differenceWithSelectedDate = currDiff;
      selectedDate = currDate;
    }
  })
  return selectedDate;
}

export function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Given a date, calculate the next date given an array of possibleDates
 * @param {String} date - as dayjs obj
 * @param {Array<String>} posibleDates array of dates with format DD-MM
 * @returns {Object} dayjs
 */
export function displaceDate(d0, possibleDates, direction = 'inc', keepYear = false) {
  const year = d0.format('YYYY');
  const lookForIt = d0.format('DD-MM');
  const selectedIndex = direction === 'inc'
    ? possibleDates.indexOf(lookForIt) + 1
    : possibleDates.indexOf(lookForIt) - 1;
  if (selectedIndex < 0) {
    return dayjs(`${possibleDates[mod(selectedIndex, possibleDates.length)]}-${keepYear ? year : year-1 }`, 'DD-MM-YYYY');
  } else if (selectedIndex >= possibleDates.length) {
    return dayjs(`${possibleDates[mod(selectedIndex, possibleDates.length)]}-${keepYear ? year : year+1 }`, 'DD-MM-YYYY');
  }
  return dayjs(`${possibleDates[selectedIndex]}-${year}`, 'DD-MM-YYYY');
}


export function leftPadding(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

export function isErrorCode(statusCode) {
  return ![200, 201, 204].includes(statusCode);
}

export async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export function calculateTotals(transactions) {
  let expenses = 0;
  let income = 0;
  transactions?.forEach((t) => {
    if (t.amount > 0) income += Math.abs(t.amount);
    else expenses += Math.abs(t.amount);
  });
  return {
    expenses: expenses.toFixed(2),
    income: income.toFixed(2),
  }
}