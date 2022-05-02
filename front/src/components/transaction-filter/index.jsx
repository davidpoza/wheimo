import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import FilterList from '@material-ui/icons/FilterList';
import Drawer from '@material-ui/core/Drawer';
import TextField from '@material-ui/core/TextField';
import i18n from 'utils/i18n';


// own

import withIsMobile from 'hocs/with-is-mobile.jsx';
import CreateTransationDialog from '../create-transaction-dialog';
import FiltersOnDrawer from './children/filters-on-drawer';
import useStyles from './styles';


function TransactionFilter({
  handleChangeFilter, showCharts = false, filter, isMobile, lng,
}) {
  const classes = useStyles();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resetFilters = () => {
    handleChangeFilter({ isReset: true });
  }

  const toggleDrawer = () => {
    setFiltersOpen(!filtersOpen);
  }

  return (
    <div className={classes.root}>
       <TextField
        size={ isMobile ? "small" : 'medium' }
        className={classes.search}
        id="search"
        placeholder={i18n.t('searchBar.searchPlaceholder', { lng })}
        type="text"
        value={filter.search || ""}
        fullWidth
        variant="outlined"
        onChange={(e) => {
          handleChangeFilter({ search: e.target.value });
        }}
        InputProps={{
          type: 'search'
        }}
      />
      <IconButton
        className={classes.filterButton}
        color="primary"
        title={i18n.t('searchBar.applyFilters', { lng })}
        onClick={toggleDrawer}
      >
        <FilterList />
      </IconButton>
      <CreateTransationDialog />
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={toggleDrawer}
      >
        <FiltersOnDrawer
          accountId={filter.accountId}
          accountIdKey={filter.accountIdKey}
          endDate={filter.endDate}
          infLimit={filter.infLimit}
          operationType={filter.operationType}
          resetFilters={resetFilters}
          search={filter.search}
          setFiltersOpen={setFiltersOpen}
          showCharts={showCharts}
          startDate={filter.startDate}
          supLimit={filter.supLimit}
          tags={filter.tags}
          tagIds={filter.tagIds}
          isFav={filter.isFav}
          hasAttachments={filter.hasAttachments}
          handleChangeFilter={handleChangeFilter}
        />
      </Drawer>

</div>
  );
}

TransactionFilter.propTypes = {
  showCharts: PropTypes.bool,
  handleChangeFilter: PropTypes.func,
  toggleCharts: PropTypes.func,
  filter: PropTypes.object,
};

const mapStateToProps = (state) => ({
  showCharts: state.transaction.showCharts,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withIsMobile(TransactionFilter));
