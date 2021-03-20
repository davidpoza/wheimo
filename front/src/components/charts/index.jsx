import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// own
import useStyles from './styles';
import BalanceEvolutionChart from './children/balance-evolution-chart';
import TagExpensesChart from './children/tag-expenses-chart';

function Charts({ transactions, expenses }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BalanceEvolutionChart transactions={transactions} />
      <TagExpensesChart tags={expenses} />
    </div>
  );
}

Charts.propTypes = {
  transactions: PropTypes.array,
  expenses: PropTypes.object,
};

const mapStateToProps = (state) => ({
  transactions: state.transaction.fetchedTransactions,
  expenses: state.transaction.expensesByTag,
});

export default connect(mapStateToProps)(Charts);
