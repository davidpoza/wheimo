import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function ToolTip({ balance, date }) {
  console.log(date);
  const classes = useStyles();
  return (
    <div>
      <div>
        {date}
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
  /* TODO:
    tengo que proporcionar una lista con un solo valor por fecha (dia).
    Tengo que usar un datetime para poder discernir cuál es la última transaction del día que llevará el balance que necesito.
  */
  const formatData = (data) => data.map(
    (value) => ({
      x: dayjs(new Date(value.date)).format('YYYY-MM-DD'),
      y: value.balance,
      // date: value.date,
    }),
  );
  console.log(formatData(transactions));
  return (
    <div className={classes.root}>
      <ResponsiveLine
        colors={{ scheme: 'set1' }}
        pointSize={4}
        curve="monotoneX"
        useMesh // interaction with mouse
        animate={false}
        // tooltip={
        //   (v) => (
        //     <ToolTip
        //       balance={v.point.data.yFormatted}
        //       date={v.point.data.x}
        //     />
        //   )
        // }
        margin={{
          top: 20, right: 20, bottom: 130, left: 60,
        }}
        data={[
          {
            id: 'balance evolution',
            data: formatData(transactions),
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
          format: '%b %d',
          tickValues: 'every 30 days',
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
