import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// own

import useStyles from './styles';
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';
import {
  toggleCharts as toggleChartsAction,
} from '../../actions/transaction';

function TransactionFilter({ handleChangeFilter, toggleCharts, showCharts = false }) {
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
    if (tags && tags.length > 0) filter.tags = tags;

    if (Object.keys(filter).length > 0) {
      handleChangeFilter(filter);
    }
  }, [endDate, startDate, accountId, tags]);

  return (
    <div className={classes.root}>
      <MuiPickersUtilsProvider utils={DayJsUtils}>
        <KeyboardDatePicker
         className={classes.dateSelector}
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
          className={classes.dateSelector}
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
      <FormGroup row className={classes.chartsSwitch}>
        <FormControlLabel
          control={<Switch checked={showCharts} onChange={toggleCharts} name="incoming" />}
          label="Show charts"
        />
      </FormGroup>
</div>
  );
}

TransactionFilter.propTypes = {
  showCharts: PropTypes.bool,
  handleChangeFilter: PropTypes.func,
  toggleCharts: PropTypes.func,
};

const mapStateToProps = (state) => ({
  showCharts: state.transaction.showCharts,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCharts: () => {
    dispatch(toggleChartsAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionFilter);
