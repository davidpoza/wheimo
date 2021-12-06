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
  const [accountId, setAccountId] = useState();
  const [infLimit, setInfLimit] = useState('');
  const [supLimit, setSupLimit] = useState('');
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [search, setSearch] = useState('');

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
  }, [endDate, startDate, accountId, tags, showCharts, setPage, search]);


  const resetFilters = () => {
    setStartDate(dayjs().subtract(3, 'month').toDate());
    setEndDate(dayjs().toDate());
    setSearch('');
    setTags([]);
    setAccountId(undefined);
    setInfLimit('');
    setSupLimit('');
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
        anchor="left"
        open={filtersOpen}
        onClose={toggleDrawer}
      >
        <FiltersOnDrawer
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          accountId={accountId}
          setAccountId={setAccountId}
          tags={tags}
          setTags={setTags}
          showCharts={showCharts}
          toggleCharts={toggleCharts}
          resetFilters={resetFilters}
          search={search}
          setSearch={setSearch}
          infLimit={infLimit}
          supLimit={supLimit}
          setSupLimit={setSupLimit}
          setInfLimit={setInfLimit}
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
