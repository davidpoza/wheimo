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
  const HEADER_FOOTER_SIZE = 310 + 74; // TODO: this value should be calculated
  const ITEM_SIZE = 81; // TODO: this value should be calculated
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
                    key={index}
                    id={transaction.id}
                    index={index}
                    indexInStore={(page - 1) * pageSize + index}
                    emitterName={transaction.emitterName}
                    receiverName={transaction.receiverName}
                    description={transaction.description}
                    comments={transaction.comments}
                    date={transaction.date}
                    valueDate={transaction.valueDate}
                    tags={transaction.tags}
                    amount={transaction.amount}
                    account={transaction.account.name}
                    handleToggle={() => { console.log(''); }}
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
