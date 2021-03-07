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
import { fetchAll as fetchAllAccounts } from '../../api-client/account';

function AccountSelect({
  user, label, value, handleChange,
}) {
  const classes = useStyles();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllAccounts(user.token);
        setAccounts(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user]);

  return (
    <FormControl>
      <InputLabel id="account-label">{label}</InputLabel>
      <Select
        className={classes.accountSelector}
        labelId="account-label"
        id="account"
        value={value}
        renderValue={(v) => get(accounts.filter((entry) => entry.id === v), '[0].name')}
        onChange={handleChange}
      >
        {
          accounts.map((entry, index) => (
            <MenuItem key={index} value={entry.id}>{entry.name}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}

AccountSelect.propTypes = {
  user: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

export default connect(mapStateToProps)(AccountSelect);
