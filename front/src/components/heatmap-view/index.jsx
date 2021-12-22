import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

// own
import withIsMobile from 'hocs/with-is-mobile.jsx';
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
  }, [setRawData, user, from, to]);

  const moveBack = () => {
    setFrom(dayjs(from, 'YYYY-MM-DD').subtract(timeWindow, 'months').format('YYYY-MM-DD'));
    setTo(dayjs(to, 'YYYY-MM-DD').subtract(timeWindow, 'months').format('YYYY-MM-DD'));
  };

  const moveForward = () => {
    setFrom(dayjs(from, 'YYYY-MM-DD').add(timeWindow, 'months').format('YYYY-MM-DD'));
    setTo(dayjs(to, 'YYYY-MM-DD').add(timeWindow, 'months').format('YYYY-MM-DD'));
  };

  return (
    <div className={classes.root}>

      <div className={classes.buttons} >
        <IconButton aria-label="back" className={classes.margin} size="small" onClick={moveBack}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <span>{dayjs(from, 'YYYY-MM-DD').format('YYYY')}</span>
        <IconButton aria-label="forward" className={classes.margin} size="small" onClick={moveForward}>
          <ArrowForwardIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div className={classes.map}>
        <Heatmap isMobile={isMobile} from={from} to={to} rawData={rawData}  />
      </div>
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