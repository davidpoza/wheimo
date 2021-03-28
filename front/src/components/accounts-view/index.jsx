import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import {
  fetchAll as fetchAccountsAction,
} from '../../actions/account';
import EditTagDialog from '../edit-tag-dialog';
import AccountsList from './_children/accounts-list';
import OperationDropdown from '../operation-dropdown';
import CreateTagInput from './_children/create-tag-input';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';

function AccountsView({
  user, fetchAccounts,
}) {
  const classes = useStyles();

  useEffect(() => {
    fetchAccounts(user.token);
  }, []);

  return (
    <div className={classes.root}>
      <OperationDropdown entity="tag" />
      <AccountsList />
      <CreateTagInput />
      <EditTagDialog />
    </div>
  );
}

AccountsView.propTypes = {
  user: PropTypes.object,
  fetchAccounts: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAccounts: (token) => {
    dispatch(fetchAccountsAction(token))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(AccountsView));
