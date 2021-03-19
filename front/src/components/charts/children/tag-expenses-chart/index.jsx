import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ResponsivePie } from '@nivo/pie';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function ToolTip({ balance, date }) {
  const classes = useStyles();
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

const mytheme = {
  tooltip: {
    basic: { whiteSpace: 'pre', display: 'flex', alignItems: 'center' },
    container: {
      fontFamily: 'Roboto, sans-serif',
      background: 'white',
      color: 'inherit',
      fontSize: 'inherit',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
    },
    table: {},
    tableCell: { padding: '3px 5px' },
  },
  labels: {
    text: {
      fill: '#333333', fontSize: 9, fontFamily: 'Roboto, sans-serif', color: '#999999',
    },
  },
};

function TagExpenses({ tags }) {
  const classes = useStyles();

  const formatData = (data) => Object.keys(tags)
    .map(
      (tag) => ({ id: tags[tag].name, value: Math.abs(tags[tag].amount) }),
    );

  return (
    <div className={classes.root}>
      <ResponsivePie
        data={formatData(tags)}
        margin={{
          top: 20, right: 40, bottom: 20, left: 40,
        }}
        theme={mytheme}
      />
    </div>
  );
}

TagExpenses.propTypes = {
  tags: PropTypes.array,
};

export default TagExpenses;
