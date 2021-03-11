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
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';

function TransactionFilter({ handleChangeFilter }) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [accountId, setAccountId] = useState();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const filter = {};
    const strStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const strEndDate = dayjs(endDate).format('YYYY-MM-DD');
    if (strStartDate && strEndDate && strStartDate !== strEndDate) {
      filter.from = strStartDate;
      filter.to = strEndDate;
    } else if (strStartDate && !strEndDate) {
      filter.from = strStartDate;
    } else if (!strStartDate && strEndDate) {
      filter.to = strEndDate;
    }
    if (accountId) filter.accountId = accountId;
    if (tags) filter.tags = tags;

    if (Object.keys(filter).length > 0) {
      handleChangeFilter(filter);
    }
  }, [endDate, startDate, accountId, tags]);

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
      <AccountSelect
        label="Account"
        value={accountId}
        handleChange={(e) => { setAccountId(e.target.value); }}
      />
      <TagsSelect limitTags={3} label="Tags" values={tags} handleOnChange={ (e, value) => {
        setTags(value.map((tag) => (tag.id)));
      } } />
    </div>
  );
}

TransactionFilter.propTypes = {
  handleChangeFilter: Proptypes.func,
};

export default TransactionFilter;
