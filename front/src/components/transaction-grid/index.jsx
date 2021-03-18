import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import TransactionGridItem from '../transaction-grid-item';
import useStyles from './styles';
import useWindowSize from '../../hooks/use-window-size';
import OperationDropdown from '../operation-dropdown';

function TransactionGrid({ transactions }) {
  const classes = useStyles();
  const windowSize = useWindowSize();
  const HEADER_FOOTER_SIZE = 64 + 94 + 64 + 56 + 90; // TODO: this value should be calculated
  const ITEM_SIZE = 60; // TODO: this value should be calculated
  const pageSize = windowSize
    ? Math.round((windowSize.height - HEADER_FOOTER_SIZE) / ITEM_SIZE)
    : 0;
  const [page, setPage] = useState(1);

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = (transactions && pageSize)
    ? transactions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
    : [];

  const pagesCount = Math.floor(transactions.length / pageSize);
  return (
    <div id="ww" className={classes.root}>
      <OperationDropdown />
      {
        chunk && transactions
          && <>
            <List>
              {
                chunk.map((transaction, index) => (
                  <TransactionGridItem
                    account={transaction.account.name}
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
            <div className={classes.bottomBar}>
              <div className={classes.resultsCounter}>
                {`${transactions.length} results found`}
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
};

export default TransactionGrid;
