import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


// own
import Heatmap from './_children/heatmap';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';
import { fetchAll } from 'api-client/heatmap';

function HeatmapView({
  user,
}) {
  const classes = useStyles();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    (async () => {
      if (user?.token) setRawData(await fetchAll(user?.token, {  }));
    })();
  }, [setRawData, user]);

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