import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

// own
import { fetchAll } from '../../actions/transaction';
import TransactionGrid from '../transaction-grid';
import TransactionFilter from '../transaction-filter';
import CreateTransationDialog from '../create-transaction-dialog';
import DetailsDialog from '../details-dialog';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';

function HomeView({ user, transactions = [], fetchAllTransactions }) {
  const classes = useStyles();

  useEffect(() => {
    fetchAllTransactions(user.token, { from: dayjs().subtract(3, 'month').format('YYYY-MM-DD') });
  }, []);

  function handleChangeFilter(filter) {
    // TODO: call fetch action depending on filters selected
    fetchAllTransactions(user.token, filter);
  }

  return (
    <div id="tt" className={classes.root}>
      <TransactionFilter handleChangeFilter={handleChangeFilter} />
      <TransactionGrid transactions={transactions} />
      <CreateTransationDialog />
      <DetailsDialog />
    </div>
  );
}

HomeView.propTypes = {
  user: PropTypes.object,
  transactions: PropTypes.array,
  fetchAllTransactions: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  transactions: state.transaction.transactionsFetched,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllTransactions: (token, page, size) => {
    dispatch(fetchAll(token, page, size))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(HomeView));
