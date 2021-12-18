import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import { getInnerHeight } from 'utils/utilities';
import TransactionGridItem from '../transaction-grid-item';
import useStyles from './styles';
import OperationDropdown from '../operation-dropdown';
import {
  setPage as setPageAction,
} from 'actions/transaction';

function TransactionGrid({ transactions, page = 1, setPage }) {
  const classes = useStyles();
  const listRef = useRef();
  const [pageSize, setPageSize] = useState(0);
  const ITEM_SIZE = 60;

  useEffect(() => {
    if (listRef?.current) {
      setPageSize(Math.floor(getInnerHeight(listRef?.current) / ITEM_SIZE));
    }
  }, []);

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = (transactions && pageSize)
    ? transactions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    : [];

  const pagesCount = Math.floor(transactions.length / pageSize);
  console.log(">>", page)
  return (
    <div className={classes.root}
      style={{
        justifyContent: transactions.length === 0
          ? 'center'
          : 'space-between',
      }}>
      <OperationDropdown />
      {
        chunk && transactions
          && <>
            {
              transactions.length > 0
                ? <List ref={listRef} className={classes.list}>
                    {
                      chunk.map((transaction, index) => (
                        <TransactionGridItem
                          accountIdentifier={transaction.account.name}
                          accountDescription={transaction.account.description}
                          accountBalance={transaction.balance}
                          amount={transaction.amount}
                          checked={transaction.checked || false}
                          comments={transaction.comments}
                          date={transaction.date}
                          description={transaction.description}
                          emitterName={transaction.emitterName}
                          favourite={transaction.favourite}
                          id={transaction.id}
                          index={index}
                          indexInStore={(page - 1) * pageSize + index}
                          key={index}
                          receiverName={transaction.receiverName}
                          tags={transaction.tags}
                          valueDate={transaction.valueDate}
                        />
                      ))
                    }
                  </List>
                : <div>
                    No results found
                  </div>
            }
            <div className={classes.bottomBar}>
              <div className={classes.resultsCounter}>
                { transactions.length !== 0 && `${transactions.length} results found`}
              </div>
              <Pagination
                className={classes.pagination}
                count={Math.ceil(transactions.length / pageSize)}
                onChange={handlePageChange}
                hidePrevButton={pagesCount === 0}
                hideNextButton={pagesCount === 0}
              />
            </div>
          </>
      }
    </div>
  );
}

TransactionGrid.propTypes = {
  transactions: PropTypes.array,
  page: PropTypes.number,
  setPage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  page: state.transaction.page,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (p) => {
    dispatch(setPageAction(p));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionGrid);
