import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// own
import useStyles from './styles';
function OperationTypeSelect({ operationType, setOperationType }) {
  const classes = useStyles();

  const handleOnChange = (e) => {
    setOperationType(e.target.value);
  }


  return (
    <FormControl className={classes.root} fullWidth>
      <InputLabel id="operation-type-label">Operation type</InputLabel>
      <Select
        className={classes.selector}
        labelId="account-label"
        id="account"
        value={operationType}
        onChange={handleOnChange}
      >
        <MenuItem key="all" value="all">Show all</MenuItem>
        <MenuItem key="expense" value="expense">Show only expenses</MenuItem>
        <MenuItem key="income" value="income">Show only incomes</MenuItem>
      </Select>
    </FormControl>
  );
}

OperationTypeSelect.propTypes = {
  operationType: PropTypes.string,
  setOperationType: PropTypes.func
};

export default OperationTypeSelect;
