import React, { useState, useEffect, useCallback  } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

// own
import {
  fetchAll as fetchAllAction,
  fetchExpensesByTag as fetchExpensesByTagAction,
  detailsDialogOpen as openAction,
  setPage as setPageAction,
} from 'actions/transaction';
import constants from 'utils/constants';
import {
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from 'actions/ui';
import withLoader from 'hocs/with-loader';
import withMessages from 'hocs/with-messages';
import TransactionGrid from '../transaction-grid';
import Charts from '../charts';
import TransactionFilter from '../transaction-filter';
import DetailsDialog from '../details-dialog';
import MergeDialog from '../merge-dialog';
import TaggingDialog from '../tagging-dialog';
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
  setPage,
}) {
  const classes = useStyles();
  const {id} = useParams();

  // shared state for filters (used from filters-on-drawer and transaction-filter)
  const [ filter, setFilter ] = useState(constants.initialFilter);

  useEffect(() => {
    if (id) {
      const index = transactions.findIndex(t => t.id === parseInt(id, 10));
      if (index !== -1) {
        changeIndex(index);
        changeId(id);
        openDetailsDialog();
      }
    }
  }, [changeIndex, changeId, openDetailsDialog, id, transactions]);

  useEffect(() => {
    fetchAllTransactions(user.token, {
      startDate: constants.initialFilter.startDate,
      isDraft: onlyDrafts,
      sort: 'desc',
    });
    fetchExpenses(user.token, {
      from: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    });
  }, [onlyDrafts, fetchExpenses, fetchAllTransactions, user.token]);

  const handleChangeFilter = useCallback(({
    isReset, startDate, endDate, accountId, tags, search, infLimit, supLimit, operationType, isFav, hasAttachments, _onlyDrafts
  }) => {
    const newFilter = { ...(isReset ? constants.initialFilter : filter) };

    if (!isReset) {
      newFilter.search = search?.length > 0 ? search : undefined;
      if (startDate) newFilter.startDate = startDate;
      if (endDate) newFilter.endDate = endDate;
      if (accountId) newFilter.accountId = accountId;
      if (tags) {
        newFilter.tags = tags;
        newFilter.tagIds = tags.map((tag) => tag.id);
        if (newFilter.tagIds?.length === 0) newFilter.tagIds = undefined;
      }
      if (infLimit) newFilter.infLimit = infLimit;
      if (supLimit) newFilter.supLimit = supLimit;
      if (infLimit === '0') newFilter.infLimit = undefined;
      if (supLimit === '0') newFilter.supLimit = undefined;
      if (operationType) newFilter.operationType = operationType;
      if (isFav !== undefined) newFilter.isFav = isFav ? 1 : undefined;
      if (hasAttachments !== undefined) newFilter.hasAttachments = hasAttachments ? 1 : undefined;
      if (_onlyDrafts !== undefined) newFilter.isDraft = _onlyDrafts ? 1 : undefined;
    }


    // TODO: call fetch action depending on filters selected
    fetchAllTransactions(user.token, {...newFilter, sort: 'desc'});
    fetchExpenses(user.token, {...newFilter});
    setFilter(newFilter);
    if (Object.keys(newFilter).length > 0) {
      setPage(1);
    }

  }, [fetchAllTransactions, fetchExpenses, user.token, setFilter, setPage, filter ]);

  return (
    <div id="tt" className={classes.root}>
      <TransactionFilter
        onlyDrafts={onlyDrafts}
        handleChangeFilter={handleChangeFilter}
        filter={filter}
      />
      {showCharts ? (
        <Charts />
      ) : (
        <TransactionGrid
          transactions={transactions}
          handleChangeFilter={handleChangeFilter}
          filter={filter}
        />
      )}

      <DetailsDialog />
      <MergeDialog />
      <TaggingDialog />
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
  setPage: PropTypes.func,
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
  setPage: (p) => {
    dispatch(setPageAction(p));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withMessages(withLoader(HomeView)));
