import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import YearSelector from 'shared/year-selector';
import useYearSelector from 'shared/year-selector/useYearSelector';
import withIsMobile from 'hocs/with-is-mobile.jsx';
import Heatmap from './_children/bar-chart';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';
import { fetchAll } from 'api-client/total';

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


function ChartView({
  user, isMobile
}) {
  const classes = useStyles();
  const [rawData, setRawData] = useState([]);
  const callback = useCallback(async ({ token, from, to }) => {
    setRawData(await fetchAll(token, { from, to, groupBy: 'month' }));
  }, [setRawData]);

  const {
    from,
    to,
    moveBack,
    moveForward
  } = useYearSelector({ user, calculateDateRangeList, isMobile, callback });

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <YearSelector
          calculateDateRangeList={calculateDateRangeList}
          callback={callback}
          from={from}
          moveBack={moveBack}
          moveForward={moveForward}
        />
      </div>
      <div className={classes.info}>
        <div className={classes.map}>
          <Heatmap isMobile={isMobile} from={from} to={to} rawData={{ 'all': rawData }} />
        </div>
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

export default connect(mapStateToProps)(withIsMobile(withLoader(ChartView)));