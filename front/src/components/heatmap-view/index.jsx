import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import withIsMobile from 'hocs/with-is-mobile.jsx';

// own
import Heatmap from './_children/heatmap';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';
import { fetchAll } from 'api-client/heatmap';

function HeatmapView({
  user, isMobile
}) {
  const classes = useStyles();
  const [timeWindow, setTimeWindow] = useState(isMobile ? 6 : 12); // in months, 6 in mobile
  const [from, setFrom] = useState(dayjs().subtract(timeWindow, 'months').format('YYYY-MM-DD'));
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    (async () => {
      if (user?.token) setRawData(await fetchAll(user?.token, { from, to }));
    })();
  }, [setRawData, user]);

  return (
    <div className={classes.root}>
      <Heatmap isMobile={isMobile} from={from} to={to} rawData={rawData}  />
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

export default connect(mapStateToProps)(withIsMobile(withLoader(HeatmapView)));