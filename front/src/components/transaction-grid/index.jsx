import React, { useState, useEffect, useRef } from 'react';
import Proptypes from 'prop-types';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import TransactionGridItem from '../transaction-grid-item';
import useStyles from './styles';
import useWindowSize from '../../hooks/use-window-size';
import OperationDropdown from '../operation-dropdown';

const contextMenuInitialState = {
  mouseX: null,
  mouseY: null,
};
function TransactionGrid({ transactions }) {
  const classes = useStyles();
  const windowSize = useWindowSize();
  const HEADER_FOOTER_SIZE = 310 + 74; // TODO: this value should be calculated
  const ITEM_SIZE = 81; // TODO: this value should be calculated
  const PAGE_SIZE = windowSize
    ? Math.round((windowSize.height - HEADER_FOOTER_SIZE) / ITEM_SIZE)
    : 0;
  const [page, setPage] = useState(1);
  const [contextMenuState, setContextMenuState] = useState(contextMenuInitialState);
  const [contextMenuId, setContextMenuId] = useState(); // transaction.id associated to grid item

  function handleOnContextMenu(event, transactionId) {
    setContextMenuId(transactionId);
    event.preventDefault();
    setContextMenuState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  }

  function handleCloseContextMenu() {
    setContextMenuId(undefined);
    setContextMenuState(contextMenuInitialState);
  }

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = (transactions && PAGE_SIZE)
    ? transactions.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE)
    : [];

  const pagesCount = Math.floor(transactions.length / PAGE_SIZE);
  return (
    <div id="ww" className={classes.root}>
      <OperationDropdown
        contextMenuId={contextMenuId}
        handleClose={handleCloseContextMenu}
        contextMenuState={contextMenuState}
        handleOnContextMenu={handleOnContextMenu}
      />
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
                    handleOnContextMenu={handleOnContextMenu}
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
                count={Math.floor(transactions.length / PAGE_SIZE)}
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
  transactions: Proptypes.array,
};

export default TransactionGrid;
