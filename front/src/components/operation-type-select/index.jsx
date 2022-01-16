import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// own
import i18n from 'utils/i18n';
import useStyles from './styles';
function OperationTypeSelect({ operationType, setOperationType, lng }) {
  const classes = useStyles();

  const handleOnChange = (e) => {
    setOperationType(e.target.value);
  }


  return (
    <FormControl className={classes.root} fullWidth>
      <InputLabel id="operation-type-label">{i18n.t('filters.opType', { lng })}</InputLabel>
      <Select
        className={classes.selector}
        labelId="account-label"
        id="account"
        value={operationType}
        onChange={handleOnChange}
      >
        <MenuItem key="all" value="all">{i18n.t('filters.showAllTypes', { lng })}</MenuItem>
        <MenuItem key="expense" value="expense">{i18n.t('filters.showExpensesType', { lng })}</MenuItem>
        <MenuItem key="income" value="income">{i18n.t('filters.showIncomesType', { lng })}</MenuItem>
      </Select>
    </FormControl>
  );
}

OperationTypeSelect.propTypes = {
  operationType: PropTypes.string,
  setOperationType: PropTypes.func,
};

const mapStateToProps = (state) => ({
  lng: state.user?.current?.lang,
});


export default connect(mapStateToProps)(OperationTypeSelect);