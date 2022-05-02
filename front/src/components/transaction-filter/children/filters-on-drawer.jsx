import React from 'react';
import { connect } from 'react-redux';
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
import i18n from 'utils/i18n';

import useStyles from '../styles';

function FiltersOnDrawer({
  accountId,
  accountIdKey,
  endDate,
  hasAttachments,
  infLimit,
  isFav,
  lng,
  operationType,
  resetFilters,
  search,
  startDate,
  supLimit,
  setFiltersOpen,
  tags,
  handleChangeFilter,
 }) {
  const classes = useStyles();
  return (
    <div className={classes.drawerRoot}>
      <h2>{i18n.t('filters.title', {lng})}</h2>
      <TextField
        id="search"
        label={i18n.t('filters.byText', {lng})}
        type="text"
        value={search || ""}
        fullWidth
        onChange={(e) => {
          handleChangeFilter({
            search: e.target.value,
          });
        }}
      />
      <MuiPickersUtilsProvider utils={DayJsUtils}>
        <KeyboardDatePicker
          className={classes.dateSelector}
          margin="normal"
          id="date-picker-dialog"
          label={i18n.t('filters.startDate', {lng})}
          format="DD/MM/YYYY"
          value={startDate}
          onChange={(date) => {
            handleChangeFilter({
              startDate: date,
            });
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          className={classes.dateSelector}
          margin="normal"
          id="date-picker-dialog"
          label={i18n.t('filters.endDate', {lng})}
          format="DD/MM/YYYY"
          value={endDate}
          onChange={(date) => {
            handleChangeFilter({
              endDate: date,
            });
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>

      <AccountSelect
        key={accountIdKey}
        className={classes.accountSelector}
        label={i18n.t('filters.account', {lng})}
        value={accountId}
        handleChange={(e) => {
          handleChangeFilter({
            accountId: e.target.value,
          });
        }}
        fullWidth
      />
      <TagsSelect
        limitTags={3}
        label={i18n.t('filters.tags', {lng})}
        value={tags || []}
        handleOnChange={(e, value) => {
          handleChangeFilter({
            tags: value,
          });
        }}
      />
      <div className={classes.limits}>
        <TextField
          size="small"
          id="min"
          InputProps={{ inputProps: { min: 0 } }}
          label={i18n.t('filters.minAmount', {lng})}
          type="number"
          value={infLimit}
          onChange={(e) => {
            handleChangeFilter({
              infLimit: e.target.value,
            });
          }}
        />
        <TextField
          size="small"
          id="max"
          InputProps={{ inputProps: { min: 0 } }}
          label={i18n.t('filters.maxAmount', {lng})}
          type="number"
          value={supLimit}
          onChange={(e) => {
            handleChangeFilter({
              supLimit: e.target.value,
            });
          }}
        />
      </div>
      <OperationTypeSelect
        operationType={operationType}
        setOperationType={(value) => {
          handleChangeFilter({
            operationType: value,
          });
        }}
      />
      <FormGroup className={classes.isFavCheckbox}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isFav}
              onChange={() => {
                handleChangeFilter({
                  isFav: !isFav,
                });
              }}
              name="isFav"
            />
          }
          label={i18n.t('filters.isFavorite', { lng })}
        />
      </FormGroup>

      <FormGroup className={classes.hasAttachments}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasAttachments}
              onChange={() => {
                handleChangeFilter({
                  hasAttachments: !hasAttachments,
                });
              }}
              name="isFav"
            />
          }
          label={i18n.t('filters.hasAttachments', { lng })}
        />
      </FormGroup>

      <div className={classes.resetFilterButton} onClick={resetFilters}>
        {i18n.t('filters.reset', { lng })}
      </div>
      <div
        className={classes.closeFilterButton}
        onClick={() => setFiltersOpen(false)}
      >
        {i18n.t('filters.close', { lng })}
      </div>
    </div>
  );
}


const mapStateToProps = (state) => ({
  lng: state.user?.current?.lang,
});

export default connect(mapStateToProps)(FiltersOnDrawer);

FiltersOnDrawer.propTypes = {
  accountId: PropTypes.string,
  accountIdKey: PropTypes.string,
  endDate: PropTypes.string,
  handleChangeFilter: PropTypes.func,
  hasAttachments: PropTypes.string,
  infLimit: PropTypes.string,
  operationType: PropTypes.string,
  resetFilters: PropTypes.func,
  search: PropTypes.string,
  setFiltersOpen: PropTypes.func,
  startDate: PropTypes.string,
  supLimit: PropTypes.string,
  tags: PropTypes.array,
  tagsKey: PropTypes.string,
}