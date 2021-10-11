import React, { useState, useEffect } from 'react';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// own
import useStyles from './styles';
import {
  fetchAll as fetchAccountsAction,
} from '../../actions/account';

function BankTypeSelect({
  user, label, value, handleChange, fetchAccounts, accounts, layout = 'filter'
}) {
  const classes = useStyles();

  useEffect(() => {
    fetchAccounts(user.token);
  }, [user]);

  return (
    <FormControl>
      <InputLabel id="account-label">{label}</InputLabel>
      <Select
        className={layout === 'filter' ? classes.accountSelector : classes.accountSelectorModal}
        labelId="account-label"
        id="account"
        value={value}
        renderValue={(v) => get(accounts.filter((entry) => entry.id === v), '[0].name')}
        onChange={handleChange}
      >
        <MenuItem key='none' value={undefined}>None</MenuItem>
        {
          accounts.map((entry, index) => (
            <MenuItem key={index} value={entry.id}>{entry.name}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}

BankTypeSelect.propTypes = {
  user: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.number,
  accounts: PropTypes.array,
  handleChange: PropTypes.func,
  fetchAccounts: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  accounts: state.account.fetchedAccounts,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAccounts: (token) => {
    dispatch(fetchAccountsAction(token))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BankTypeSelect);
