import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FilterList from '@material-ui/icons/FilterList';
import BarChart from '@material-ui/icons/BarChart';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import dayjs from 'dayjs';

// own
import CreateTransationDialog from '../create-transaction-dialog';
import FiltersOnDrawer from './children/filters-on-drawer';
import useStyles from './styles';

import {
  toggleCharts as toggleChartsAction,
  setPage as setPageAction,
} from '../../actions/transaction';

function TransactionFilter({
  handleChangeFilter, toggleCharts, setPage, showCharts = false,
}) {
  const classes = useStyles();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [operationType, setOperationType] = useState('all');
  const [accountId, setAccountId] = useState();
  const [infLimit, setInfLimit] = useState('');
  const [supLimit, setSupLimit] = useState('');
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [tagsKey, setTagsKey] = useState('TagsSelect'); // ñapa!: to force rerender and reset its local state
  const [accountIdKey, setAccountIdKey] = useState('AccountId');

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
    if (infLimit) filter.min = infLimit;
    if (supLimit) filter.max = supLimit;
    if (operationType !== 'all') filter.operationType = operationType;

    if (Object.keys(filter).length > 0) {
      handleChangeFilter(filter);
      setPage(1);
    }
  }, [
    endDate,
    startDate,
    accountId,
    tags,
    showCharts,
    setPage,
    search,
    infLimit,
    supLimit,
    operationType,
    setOperationType,
  ]);


  const resetFilters = () => {
    setTagsKey(`${tagsKey}+`);
    setAccountIdKey(`${accountIdKey}+`);
    setStartDate(dayjs().subtract(3, 'month').toDate());
    setEndDate(dayjs().toDate());
    setSearch('');
    setTags([]);
    setAccountId(undefined);
    setInfLimit('');
    setSupLimit('');
    setOperationType('all');
    handleChangeFilter({});
  }

  const toggleDrawer = () => {
    setFiltersOpen(!filtersOpen);
  }

  return (
    <div className={classes.root}>
       <TextField
        className={classes.search}
        id="search"
        label="Search"
        type="text"
        value={search}
        fullWidth
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <IconButton
        className={classes.filterButton}
        color="primary"
        title="Aplicar filtros"
        onClick={toggleDrawer}
      >
        <FilterList />
      </IconButton>
      <IconButton
        className={classes.filterButton}
        color="primary"
        style={ showCharts ? { color: '#f96096' } : {}}
        title="Mostrar gráfico"
        onClick={toggleCharts}
      >
        <BarChart />
      </IconButton>
      <CreateTransationDialog />
      <Drawer
        elevation={30}
        classes={{
          root: classes.drawerRoot,
          docked: classes.drawerDocked,
        }}
        variant="persistent"
        anchor="left"
        open={filtersOpen}
        onClose={toggleDrawer}
      >
        <FiltersOnDrawer
          accountId={accountId}
          accountIdKey={accountIdKey}
          endDate={endDate}
          infLimit={infLimit}
          operationType={operationType}
          resetFilters={resetFilters}
          search={search}
          setAccountId={setAccountId}
          setEndDate={setEndDate}
          setFiltersOpen={setFiltersOpen}
          setInfLimit={setInfLimit}
          setOperationType={setOperationType}
          setSearch={setSearch}
          setStartDate={setStartDate}
          setSupLimit={setSupLimit}
          setTags={setTags}
          showCharts={showCharts}
          startDate={startDate}
          supLimit={supLimit}
          tags={tags}
          tagsKey={tagsKey}
          toggleCharts={toggleCharts}
        />
      </Drawer>

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
