import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';

// own
import useStyles from '../styles';
import SavingsChart from '../../savings-chart';
import { calculateSavingSeries } from '../../../shared/utilities';

export default function PiggyConfig({
  savingInitDate, setSavingInitDate,
  savingTargetDate, setSavingTargetDate,
  savingFrequency, setSavingFrequency,
  savingAmountFunc, setSavingAmountFunc,
  savingAmount, setSavingAmount,
  savingTargetAmount, setSavingTargetAmount,
}) {
  const classes = useStyles();
  return (
    <>
      <h2 className={classes.additionalConfig}>Piggy bank config</h2>
      <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
        <KeyboardDatePicker
          margin="normal"
          className={classes.savingInitDate}
          label="Savings start date"
          format="DD/MM/YYYY"
          value={savingInitDate}
          onChange={(date) => {
            setSavingInitDate(date);
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          className={classes.savingTargetDate}
          label="Savings end date"
          format="DD/MM/YYYY"
          value={savingTargetDate}
          onChange={(date) => {
            setSavingTargetDate(date);
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        required
        className={classes.savingFrequency}
        margin="dense"
        id="savingFrequency"
        label="Saving Frequency, e.g.: 1w"
        type="text"
        value={savingFrequency}
        onChange={(e) => {
          setSavingFrequency(e.target.value);
        }}
      />
      <TextField
        required
        className={classes.savingAmountFunc }
        margin="dense"
        id="savingAmountFunc"
        label="Saving Expression, e.g.: n+1"
        type="text"
        value={savingAmountFunc}
        onChange={(e) => {
          setSavingAmountFunc(e.target.value);
        }}
      />
      <TextField
        required
        className={classes.savingAmount}
        margin="dense"
        id="savingAmount"
        label="Saving amount"
        type="number"
        value={savingAmount}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (n > 0) setSavingAmount(e.target.value);
        }}
      />
      <TextField
        required
        className={classes.savingTargetAmount}
        margin="dense"
        id="savingTargetAmount"
        label="Saving target amount"
        type="number"
        value={savingTargetAmount}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (n > 0) setSavingTargetAmount(e.target.value);
        }}
      />
      <SavingsChart
        serie={ calculateSavingSeries(
          parseFloat(savingAmount),
          parseFloat(savingTargetAmount),
          savingInitDate,
          savingTargetDate,
          savingFrequency,
          savingAmountFunc,
        ) } />
    </>
  );
}

PiggyConfig.propTypes = {
  savingInitDate: PropTypes.string,
  setSavingInitDate: PropTypes.func,
  savingTargetDate: PropTypes.string,
  setSavingTargetDate: PropTypes.func,
  savingFrequency: PropTypes.string,
  setSavingFrequency: PropTypes.func,
  savingAmountFunc: PropTypes.string,
  setSavingAmountFunc: PropTypes.func,
  savingAmount: PropTypes.number,
  setSavingAmount: PropTypes.func,
  savingTargetAmount: PropTypes.number,
  setSavingTargetAmount: PropTypes.func,
};
