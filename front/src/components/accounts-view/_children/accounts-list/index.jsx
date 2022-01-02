import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';

// own
import AccountsListItem from '../accounts-list-item';
import useStyles from './styles';
import { azOrder } from '../../../../utils/utilities';

function AccountsList({
  user, accounts = [],
}) {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  return (
    <List className={classes.root} component="nav" aria-label="main mailbox folders">
      {
        accounts.sort(azOrder).map((account, index) => (
          <AccountsListItem
            id={account.id}
            index={index}
            indexInStore={index}
            key={account.id}
            name={account.name}
            number={account.number}
            balance={account.balance}
            savingTargetAmount={account.savingTargetAmount}
            description={account.description}
            bankId={account.bankId}
          />
        ))
      }
    </List>
  );
}

AccountsList.propTypes = {
  user: PropTypes.object,
  accounts: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  accounts: state.account.fetchedAccounts,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AccountsList);
