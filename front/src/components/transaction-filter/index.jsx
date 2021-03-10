import React, { useState, useEffect, useRef } from 'react';
import Proptypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own

import useStyles from './styles';

function TransactionFilter({ handleChangeFilter }) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    handleChangeFilter({
      from: dayjs(startDate).format('YYYY-MM-DD'),
      to: dayjs(endDate).format('YYYY-MM-DD'),
    });
  }, [endDate, startDate]);

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Start date"
          format="DD/MM/YYYY"
          value={startDate}
          onChange={(date) => { setStartDate(date); } }
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="End date"
          format="DD/MM/YYYY"
          value={endDate}
          onChange={(date) => { setEndDate(date); } }
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}

TransactionFilter.propTypes = {
  handleChangeFilter: Proptypes.func,
};

export default TransactionFilter;
