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
import TextField from '@material-ui/core/TextField';

// own

import useStyles from './styles';
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';
import {
  toggleCharts as toggleChartsAction,
  setPage as setPageAction,
} from '../../actions/transaction';

function TransactionFilter({
  handleChangeFilter, toggleCharts, setPage, showCharts = false,
}) {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState('');
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
    if (search && search.length > 0) filter.search = search;

    if (Object.keys(filter).length > 0) {
      handleChangeFilter(filter);
      setPage(1);
    }
  }, [endDate, startDate, accountId, tags, showCharts, search]);

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
      <TextField
        className={classes.search}
        id="search"
        label="Search"
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <AccountSelect
        label="Account"
        value={accountId}
        handleChange={(e) => { setAccountId(e.target.value); }}
      />
      <TagsSelect limitTags={3} label="Tags" values={tags} className={classes.tags} handleOnChange={ (e, value) => {
        setTags(value.map((tag) => (tag.id)));
      } } />
      <FormGroup row className={classes.chartsSwitch}>
        <FormControlLabel
          control={<Switch checked={showCharts} onChange={toggleCharts} name="incoming" />}
          labelPlacement="bottom"
          label="charts"
        />
      </FormGroup>
</div>
  );
}

TransactionFilter.propTypes = {
  showCharts: PropTypes.bool,
  handleChangeFilter: PropTypes.func,
  toggleCharts: PropTypes.func,
  setPage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  showCharts: state.transaction.showCharts,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCharts: () => {
    dispatch(toggleChartsAction());
  },
  setPage: (p) => {
    dispatch(setPageAction(p));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionFilter);
