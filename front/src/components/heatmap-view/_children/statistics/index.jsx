import React from 'react';
import dayjs from 'dayjs';

import translate from 'utils/translations/index';
import useStyles from '../../styles';

const monthsTranslation = translate('months');

export default function Statistics({ data }) {
  const classes = useStyles();
  return data?.mostExpensiveDay
    ? <ul>
        <li className={classes.item}>
          <span>Most expensive day:</span>
          <p>It was the {dayjs(data?.mostExpensiveDay, 'YYYY-MM-DD').format('DD/MM/YYYY')} with {data?.mostExpensiveAmount.toFixed(2)}€ expended.</p>
        </li>
        <li className={classes.item}>
          <span>Least expensive day:</span>
          <p>It was the {dayjs(data?.leastExpensiveDay, 'YYYY-MM-DD').format('DD/MM/YYYY')} with {data?.leastExpensiveAmount.toFixed(2)}€ expended.</p>
        </li>
        <li className={classes.item}>
          <span>Most expensive month:</span>
          <p>It was {monthsTranslation[data?.mostExpensiveMonth]?.toUpperCase()} with {data?.mostExpensiveMonthAmount.toFixed(2)}€ expended.</p>
        </li>
        <li className={classes.item}>
          <span>Least expensive month:</span>
          <p>It was {monthsTranslation[data?.leastExpensiveMonth]?.toUpperCase()} with {data?.leastExpensiveMonthAmount.toFixed(2)}€ expended.</p>
        </li>
        <li className={classes.item}>
          <span>Max days in a row with no spending at all:</span>
          <p>From {dayjs(data?.longestRowStart, 'YYYY-MM-DD').format('DD/MM/YYYY')} to {dayjs(data?.longestRowEnd, 'YYYY-MM-DD').format('DD/MM/YYYY')}, a total of {data?.longestRow} days.</p>
        </li>
      </ul>
    : null
}