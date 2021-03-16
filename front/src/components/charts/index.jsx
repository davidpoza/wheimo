import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// own
import useStyles from './styles';
import BalanceEvolutionChart from './children/balance-evolution-chart';

function Charts({ transactions }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BalanceEvolutionChart transactions={transactions} />
    </div>
  );
}

Charts.propTypes = {
  transactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  transactions: state.transaction.transactionsFetched,
});

export default connect(mapStateToProps)(Charts);
