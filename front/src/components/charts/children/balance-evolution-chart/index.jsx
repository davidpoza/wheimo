import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function ToolTip({ balance, date }) {
  return (
    <div>
      <div>
        {dayjs(date).format('DD/MM/YYYY')}
      </div>
      <div>
        {balance}€
      </div>
    </div>
  );
}

ToolTip.propTypes = {
  balance: PropTypes.number,
  date: PropTypes.string,
};

function BalanceEvolutionChart({ transactions }) {
  const classes = useStyles();

  /**
   * We left only last transaction of the day, it'll has the updated balance for this date.
  */
  function cleanTransactions(transArray) {
    return transArray.filter((t, i, arr) => !dayjs(arr[i].date).isSame(arr[i + 1]?.date, 'day'));
  }

  const formatData = (data) => data.map(
    (value) => ({
      x: dayjs(new Date(value.date)).format('YYYY-MM-DD'),
      y: value.balance,
      date: dayjs(new Date(value.date)).format('YYYY-MM-DD HH:mm'),
    }),
  );

  return (
    <div className={classes.root}>
      <ResponsiveLine
        colors={{ scheme: 'set1' }}
        pointSize={4}
        curve="monotoneX"
        useMesh // interaction with mouse
        animate={false}
        tooltip={
          (v) => (
            <ToolTip
              balance={v.point.data.yFormatted}
              date={v.point.data.xFormatted}
            />
          )
        }
        margin={{
          top: 20, right: 20, bottom: 60, left: 60,
        }}
        data={[
          {
            id: 'balance evolution',
            data: formatData(cleanTransactions(transactions)),
          },
        ]}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          legendOffset: 13,
          legend: 'account balance',
        }}
        axisBottom={{
          format: '%d %b',
          legend: 'date',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
      />
    </div>
  );
}

BalanceEvolutionChart.propTypes = {
  transactions: PropTypes.array,
};

export default BalanceEvolutionChart;
