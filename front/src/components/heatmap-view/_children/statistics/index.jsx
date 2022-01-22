import React from 'react';
import dayjs from 'dayjs';
import i18n from 'utils/i18n';
import { connect } from 'react-redux';

import translate from 'utils/translations/index';
import useStyles from '../../styles';

const monthsTranslation = translate('months');

function Statistics({ data, lng }) {
  const classes = useStyles();
  return data?.mostExpensiveDay ? (
    <ul>
      <li className={classes.item}>
        <span>{i18n.t('statistics.mostExpensiveDay', {lng})}:</span>
        <p>
          {i18n.t('statistics.itWasThe', {lng})}{' '}
          {dayjs(data?.mostExpensiveDay, 'YYYY-MM-DD').format('DD/MM/YYYY')}{' '}
          {i18n.t('statistics.with', {lng})}{' '}
          {data?.mostExpensiveAmount.toFixed(2)}€ {i18n.t('statistics.expended', {lng})}.
        </p>
      </li>
      <li className={classes.item}>
        <span>{i18n.t('statistics.leastExpensiveDay', {lng})}:</span>
        <p>
          {i18n.t('statistics.itWasThe', {lng})}{' '}
          {dayjs(data?.leastExpensiveDay, 'YYYY-MM-DD').format('DD/MM/YYYY')}{' '}
          {i18n.t('statistics.with', {lng})}{' '}
          {data?.leastExpensiveAmount.toFixed(2)}€ {i18n.t('statistics.expended', {lng})}.
        </p>
      </li>
      <li className={classes.item}>
        <span>{i18n.t('statistics.mostExpensiveMonth', {lng})}:</span>
        <p>
          {i18n.t('statistics.itWas', {lng})}{' '}
          {i18n.t('time.monthsByIndex', {lng, returnObjects: true })?.[data?.mostExpensiveMonth]?.toUpperCase()}{' '}
          {i18n.t('statistics.with', {lng})}{' '}
          {data?.mostExpensiveMonthAmount.toFixed(2)}€ {i18n.t('statistics.expended', {lng})}.
        </p>
      </li>
      <li className={classes.item}>
        <span>{i18n.t('statistics.leastExpensiveMonth', {lng})}:</span>
        <p>
          {i18n.t('statistics.itWas', {lng})}{' '}
          {i18n.t('time.monthsByIndex', {lng, returnObjects: true })?.[data?.leastExpensiveMonth]?.toUpperCase()}{' '}
          {i18n.t('statistics.with', {lng})}{' '}
          {data?.leastExpensiveMonthAmount.toFixed(2)}€ {i18n.t('statistics.expended', {lng})}.
        </p>
      </li>
      <li className={classes.item}>
        <span>{i18n.t('statistics.maxDaysInRow', {lng})}:</span>
        <p>
          {i18n.t('statistics.from', {lng})}{' '}
          {dayjs(data?.longestRowStart, 'YYYY-MM-DD').format('DD/MM/YYYY')}{' '}
          {i18n.t('statistics.to', {lng})}{' '}
          {dayjs(data?.longestRowEnd, 'YYYY-MM-DD').format('DD/MM/YYYY')},{' '}
          {i18n.t('statistics.aTotalOf', {lng, days: data?.longestRow})}.
        </p>
      </li>
    </ul>
  ) : null;
}

const mapStateToProps = (state) => ({
  lng: state.user?.current?.lang,
});

export default connect(mapStateToProps)(Statistics);