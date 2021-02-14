import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// own
import { fetchAll } from '../../actions/transaction';
import TransactionGrid from '../transaction-grid';

function HomeView({ user, transactions, fetchAllTransactions }) {
  useEffect(() => {
    fetchAllTransactions(user.token, 0, 20);
  }, []);

  return (
    <div>
      <TransactionGrid transactions={transactions} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.current,
    transactions: state.transaction.transactionsFetched,
    loading: state.transaction.isLoading,
    error: state.transaction.error,
    errorMessage: state.transaction.errorMessage,
  }
}
const mapDispatchToProps = dispatch => {
  return ({
    fetchAllTransactions: (token, page, size) => {
      dispatch(fetchAll(token, page, size))
        .catch(error => {
          console.log(error.message);
        });
    },
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);