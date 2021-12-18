import React from 'react';
import PropTypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import AccountSelect from 'components/account-select';
import TagsSelect from 'components/tags-select';
import OperationTypeSelect from 'components/operation-type-select';

import useStyles from '../styles';

export default function FiltersOnDrawer({
  accountId,
  accountIdKey,
  endDate,
  infLimit,
  operationType,
  resetFilters,
  search,
  setAccountId,
  setEndDate,
  setFiltersOpen,
  setInfLimit,
  setOperationType,
  setSearch,
  setStartDate,
  setSupLimit,
  setTags,
  startDate,
  supLimit,
  tags,
  isFav,
  setIsFav,
  setTagIds
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
        key={accountIdKey}
        className={classes.accountSelector}
        label="Account"
        value={accountId}
        handleChange={(e) => { setAccountId(e.target.value); }}
        fullWidth
      />
      <TagsSelect
        limitTags={3}
        label="Tags"
        value={tags}
        handleOnChange={ (e, value) => {
          setTags(value);
          setTagIds(value.map((tag) => (tag.id)));
        } }
      />
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
      <OperationTypeSelect operationType={operationType} setOperationType={setOperationType} />
      <FormGroup className={classes.isFavCheckbox}>
        <FormControlLabel control={<Checkbox checked={isFav} onChange={() => { setIsFav(!isFav); }} name="isFav" />} label="Is marked as favourite" />
      </FormGroup>

      <div className={classes.resetFilterButton} onClick={resetFilters}>Reset filters</div>
      <div className={classes.closeFilterButton} onClick={() => setFiltersOpen(false)}>Close</div>
    </div>
  );
}

FiltersOnDrawer.propTypes = {
  accountId: PropTypes.string,
  accountIdKey: PropTypes.string,
  endDate: PropTypes.string,
  infLimit: PropTypes.string,
  operationType: PropTypes.string,
  resetFilters: PropTypes.func,
  search: PropTypes.string,
  setAccountId: PropTypes.func,
  setEndDate: PropTypes.func,
  setFiltersOpen: PropTypes.func,
  setInfLimit: PropTypes.func,
  setOperationType: PropTypes.func,
  setSearch: PropTypes.func,
  setStartDate: PropTypes.func,
  setSupLimit: PropTypes.func,
  setTags: PropTypes.func,
  startDate: PropTypes.string,
  supLimit: PropTypes.string,
  tags: PropTypes.array,
  tagsKey: PropTypes.string,
}