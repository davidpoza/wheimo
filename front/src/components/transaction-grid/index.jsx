import React, { useState, useEffect, useRef } from 'react';
import Proptypes from 'prop-types';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import TransactionGridItem from '../transaction-grid-item';
import useStyles from './styles';
import useWindowSize from '../../hooks/use-window-size';

function TransactionGrid({ transactions }) {
  const classes = useStyles();
  const windowSize = useWindowSize();
  const HEADER_FOOTER_SIZE = 310 + 74; // TODO: this value should be calculated
  const ITEM_SIZE = 81; // TODO: this value should be calculated
  const PAGE_SIZE = windowSize
    ? Math.round((windowSize.height - HEADER_FOOTER_SIZE) / ITEM_SIZE)
    : 0;
  const [page, setPage] = useState(1);

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = (transactions && PAGE_SIZE)
    ? transactions.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
    : [];

  return (
    <div id="ww" className={classes.root}>
      {
        chunk && transactions
          && <>
            <List>
              {
                chunk.map((transaction, index) => (
                  <TransactionGridItem
                    key={index}
                    index={index}
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
            <Pagination
              className={classes.pagination}
              count={Math.floor(transactions.length / PAGE_SIZE)}
              onChange={handlePageChange}
            />
          </>
      }
    </div>
  );
}

TransactionGrid.propTypes = {
  transactions: Proptypes.array,
};

export default TransactionGrid;
