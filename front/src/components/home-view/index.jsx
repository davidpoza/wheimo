import React, { useEffect } from 'react';
import { connect } from 'react-redux';

// own
import { fetchAll } from '../../actions/transaction';

function HomeView({ user, fetchAllTransactions }) {
  useEffect(() => {
    fetchAllTransactions(user.token, 0, 20);
  }, []);

  return (
    <div>
      HOME
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.current,
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