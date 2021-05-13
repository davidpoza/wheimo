import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function ToolTip({ amount, savings, date }) {
  const classes = useStyles();
  return (
    <div>
      <div>
        {dayjs(date).format('DD/MM/YYYY')}
      </div>
      <div>
        <p>
          {`Added ${amount}€.`}
          <br />
          {`Currently: ${savings}€`}
        </p>
      </div>
    </div>
  );
}

ToolTip.propTypes = {
  amount: PropTypes.number,
  savings: PropTypes.number,
  date: PropTypes.string,
};

export default function SavingsChart({ serie }) {
  const classes = useStyles();
  return <div className={classes.root}>
    <ResponsiveBar
      margin={{
        top: 5, right: 5, bottom: 45, left: 5,
      }}
      data={serie}
      indexBy="savings"
      keys={['amount', 'savings']}
      enableLabel={false}
      labelTextColor="inherit:darker(1.4)"
      tooltip={
        (v) => (
          <ToolTip
            amount={v.data.amount}
            savings={v.data.savings}
            date={v.data.date}
          />
        )
      }
      axisBottom={{
        tickRotation: -90,
        legendPosition: 'middle',
      }}
      theme={{
        axis: {
          ticks: {
            line: {
              stroke: '#383644',
            },
            text: {
              fill: '#3f51b5',
            },
          },
        },
      }}
    />
  </div>;
}

SavingsChart.propTypes = {
  serie: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      amount: PropTypes.number,
      savings: PropTypes.number,
    }),
  ),
};
