import React, { useState } from 'react';
import Proptypes from 'prop-types';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import TransactionGridItem from '../transaction-grid-item';
import useStyles from './styles';

function TransactionGrid({ transactions }) {
  const classes = useStyles();
  const PAGE_SIZE = 8; // TODO: recalculate this number with viewport height
  const [page, setPage] = useState(1);

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = transactions
    ? transactions.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
    : [];

  return (
    <div className={classes.root}>
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
