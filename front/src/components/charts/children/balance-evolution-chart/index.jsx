import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveLine } from '@nivo/line';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function ToolTip({ balance, date }) {
  const classes = useStyles();
  return (
    <div>
      <div>
        {dayjs(new Date(date)).format('DD/MM/YYYY')}
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

  const formatData = (data) => data.map(
    (value, index) => ({
      x: index + 1,
      y: value.balance,
      date: value.date,
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
              date={v.point.data.date}
            />
          )
        }
        margin={{
          top: 20, right: 20, bottom: 130, left: 60,
        }}
        data={[
          {
            id: 'views count',
            data: formatData(transactions),
          },
        ]}
        xScale={{
          type: 'linear',
        }}
        // xFormat="time:%H:%M" // used in tootltips
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
          legend: 'date',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        onClick={(e) => {
          window.open(
            e.data.link,
            '_blank', // <- This is what makes it open in a new window.
          );
        }}
      />
    </div>
  );
}

BalanceEvolutionChart.propTypes = {
  transactions: PropTypes.array,
};

export default BalanceEvolutionChart;
