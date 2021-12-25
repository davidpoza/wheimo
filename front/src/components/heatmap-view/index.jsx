import React, { useEffect, useState, useMemo } from 'react';
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
  const [index, setIndex] = useState();
  const [rawData, setRawData] = useState([]);


  const calculateDateRangeList = (isMob) => {
    const years = [...Array(10).keys()].map(y => y + 2020);
    const ret = [];
    years.forEach((y) => {
      if (isMob) {
        ret.push({
          year: y,
          from: `${y}-01-01`,
          to: `${y}-06-30`,
        });
        ret.push({
          year: y,
          from: `${y}-07-01`,
          to: `${y}-12-31`,
        });
      } else {
        ret.push({
          year: y,
          from: `${y}-01-01`,
          to: `${y}-12-31`,
        });
      }
    })
    return (ret);
  };

  const currentYear = parseInt(dayjs().format('YYYY'), 10);
  const rangesList = useMemo(() => calculateDateRangeList(isMobile), [isMobile]);
  const { from, to } = rangesList?.[index] || {};

  useEffect(() => {
    setIndex(rangesList.findIndex(r => r.year === currentYear && dayjs(r.to).diff(dayjs()) >= 0)); // we choose the range with is not passed yet
  }, [currentYear, rangesList]);

  useEffect(() => {
    (async () => {
      if (user?.token) setRawData(await fetchAll(user?.token, { from, to }));
    })();
  }, [setRawData, user, index, from, to]);



  const moveBack = () => {
    if (index > 0) setIndex(index - 1);
  };

  const moveForward = () => {
    if (index < rangesList.length-1) setIndex(index + 1);
  };


  return (
    <div className={classes.root}>

      <div className={classes.buttons} >
        <IconButton aria-label="back" className={classes.margin} size="small" onClick={moveBack}>
          <ArrowBackIcon fontSize="inherit" />
        </IconButton>
        <span>{from ? dayjs(from, 'YYYY-MM-DD').format('YYYY') : 'loading...'}</span>
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