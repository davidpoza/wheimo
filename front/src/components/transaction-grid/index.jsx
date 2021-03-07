import * as React from 'react';
import Proptypes from 'prop-types';
import List from '@material-ui/core/List';

// own
import Tags from '../tags';
import Popover from '../popover';
import TransactionGridItem from '../transaction-grid-item';

export default function TransactionGrid({ transactions }) {
  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {
        <List>
          {
            transactions && transactions.map((transaction, index) => (
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
      }

    </div>
  );
}

TransactionGrid.propTypes = {
  transactions: Proptypes.array,
};
