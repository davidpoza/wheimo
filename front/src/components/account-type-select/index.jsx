import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// own
import useStyles from './styles';

function AccountTypeSelect({
  label, value, handleChange,
}) {
  const classes = useStyles();
  const types = {
    opbk: 'Open Bank',
    wallet: 'Wallet',
    piggybank: 'Piggy Bank',
  };
  return (
    <FormControl>
      <InputLabel id="account-label">{label}</InputLabel>
      <Select
        className={classes.accountSelector}
        labelId="account-label"
        id="account"
        value={value}
        onChange={handleChange}
      >
        <MenuItem key='none' value={undefined}>None</MenuItem>
        {
          Object.keys(types).map((key) => (
            <MenuItem key={key} value={key}>{types[key]}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
}

AccountTypeSelect.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  handleChange: PropTypes.func,
};

export default AccountTypeSelect;
