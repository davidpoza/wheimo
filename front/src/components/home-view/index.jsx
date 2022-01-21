import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

// own
import {
  fetchAll as fetchAllAction,
  fetchExpensesByTag as fetchExpensesByTagAction,
  detailsDialogOpen as openAction,
} from '../../actions/transaction';
import {
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../actions/ui';
import TransactionGrid from '../transaction-grid';
import Charts from '../charts';
import TransactionFilter from '../transaction-filter';
import DetailsDialog from '../details-dialog';
import MergeDialog from '../merge-dialog';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';

function HomeView({
  user,
  transactions = [],
  fetchAllTransactions,
  showCharts,
  fetchExpenses,
  onlyDrafts,
  openDetailsDialog,
  changeId,
  changeIndex,
}) {
  const classes = useStyles();
  const {id} = useParams();

  useEffect(() => {
    if (id) {
      const index = transactions.findIndex(t => t.id === parseInt(id, 10));
      if (index !== -1) {
        changeIndex(index);
        changeId(id);
        openDetailsDialog();
      }
    }
  }, []);

  useEffect(() => {
    fetchAllTransactions(user.token, {
      from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
      isDraft: onlyDrafts,
      sort: 'desc',
    });
    fetchExpenses(user.token, {
      from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    });
  }, [onlyDrafts]);

  function handleChangeFilter(filter) {
    // TODO: call fetch action depending on filters selected
    fetchAllTransactions(user.token, {...filter, sort: 'desc'});
    fetchExpenses(user.token, {...filter});
  }

  return (
    <div id="tt" className={classes.root}>
      <TransactionFilter
        onlyDrafts={onlyDrafts}
        handleChangeFilter={handleChangeFilter}
      />
      {showCharts ? (
        <Charts />
      ) : (
        <TransactionGrid transactions={transactions} />
      )}

      <DetailsDialog />
      <MergeDialog />
    </div>
  );
}

HomeView.propTypes = {
  user: PropTypes.object,
  showCharts: PropTypes.bool,
  onlyDrafts: PropTypes.bool,
  transactions: PropTypes.array,
  fetchAllTransactions: PropTypes.func,
  fetchExpenses: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  transactions: state.transaction.fetchedTransactions,
  showCharts: state.transaction.showCharts,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAllTransactions: (token, data) => {
    dispatch(fetchAllAction(token, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
  fetchExpenses: (token, data) => {
    dispatch(fetchExpensesByTagAction(token, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
  openDetailsDialog: () => {
    dispatch(openAction());
  },
  changeId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(HomeView));
