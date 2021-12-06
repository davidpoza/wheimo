import React from 'react';
import PropTypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import TextField from '@material-ui/core/TextField';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import AccountSelect from '../../account-select';
import TagsSelect from '../../tags-select';

import useStyles from '../styles';

export default function FiltersOnDrawer({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  accountId,
  setAccountId,
  tags,
  setTags,
  resetFilters,
  search,
  setSearch,
  infLimit,
  supLimit,
  setInfLimit,
  setSupLimit
 }) {
  const classes = useStyles();

  return (
    <div className={classes.drawerRoot}>
      <h2>Filters</h2>
      <TextField
        id="search"
        label="Search"
        type="text"
        value={search}
        fullWidth
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
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
        className={classes.accountSelector}
        label="Account"
        value={accountId}
        handleChange={(e) => { setAccountId(e.target.value); }}
      />
      <TagsSelect limitTags={3} label="Tags" values={tags} handleOnChange={ (e, value) => {
        setTags(value.map((tag) => (tag.id)));
      } } />
      <div className={classes.limits}>
        <TextField
          size="small"
          id="min"
          label="Min"
          type="number"
          value={infLimit}
          onChange={(e) => {
            setInfLimit(e.target.value);
          }}
        />
        <TextField
          size="small"
          id="max"
          label="Max"
          type="number"
          value={supLimit}
          onChange={(e) => {
            setSupLimit(e.target.value);
          }}
        />
      </div>

      <div className={classes.resetFilterButton} onClick={resetFilters}>Reset filters</div>
    </div>
  );
}

FiltersOnDrawer.propTypes = {
  handleChangeFilter: PropTypes.func,
  setPage: PropTypes.func,
  showCharts: PropTypes.bool,
  toggleCharts: PropTypes.func
}