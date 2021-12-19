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
    <Grid container justify="center" alignItems="center" className={classes.root}>
      {
        [1,2,3,4,5,6,7,8,9,10,11,12].map((m) => {
          return(
            <Grid item xs={12} sm={3} className={classes.heatMap}>
              <h2>{translations('months')[m-1]}</h2>
              <Heatmap rawData={rawData} month={m} year={year} />
            </Grid>
          );
        })
      }
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

export default connect(mapStateToProps)(withLoader(HeatmapView));