import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import translations from 'utils/translations';

// own
import Heatmap from './_children/heatmap';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';
import { fetchAll } from 'api-client/transaction';

function HeatmapView({
  user,
}) {
  const classes = useStyles();
  const [year, setYear] = useState(new Date().getFullYear());
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    (async () => {
      setRawData(await fetchAll(user?.token, { year }));
    })();
  }, [year, setRawData, user]);

  return (
    <div className={classes.root}>
      <Heatmap rawData={rawData}  />
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

export default connect(mapStateToProps)(withLoader(HeatmapView));