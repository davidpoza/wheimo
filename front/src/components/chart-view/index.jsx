import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import YearSelector from 'shared/year-selector';
import useYearSelector from 'shared/year-selector/useYearSelector';
import withIsMobile from 'hocs/with-is-mobile.jsx';
import BarChart from './_children/bar-chart';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';
import { fetchAll } from 'api-client/total';
import TagList from 'components/chart-view/_children/tag-list';
import useTags from './_children/tag-list/use-tags';

const calculateDateRangeList = (isMob) => {
  const years = [...Array(10).keys()].map(y => y + 2020);
  const ret = [];
  years.forEach((y) => {
    ret.push({
      year: y,
      from: `${y}-01-01`,
      to: `${y}-12-31`,
    });
  })
  return (ret);
};


function ChartView({
  user, isMobile
}) {
  const classes = useStyles();

  const [rawData, setRawData] = useState([]);
  const callback = useCallback(async ({ token, from, to, tag }) => {
    if (tag) {
      if (!rawData[tag.name]) setRawData({
        ...rawData,
        [tag.name]: await fetchAll(token, { from, to, groupBy: 'month', tags: tag.id })
      });
    } else {
      if (!rawData.All) setRawData({
        ...rawData,
        All: await fetchAll(token, { from, to, groupBy: 'month' })
      });
    }
  }, [setRawData, rawData]);

  const {
    from,
    to,
    moveBack,
    moveForward
  } = useYearSelector({ user, calculateDateRangeList, isMobile, callback });
  const { tags, checked, handleToggle } = useTags({ user, callback, from, to });

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
          <BarChart
            tags={checked}
            from={from}
            to={to}
            rawData={rawData}
          />
        </div>
        <TagList
          tags={tags}
          from={from}
          to={to}
          callback={callback}
          checked={checked}
          handleToggle={handleToggle}
        />
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