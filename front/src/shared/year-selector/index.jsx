import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import withIsMobile from 'hocs/with-is-mobile.jsx';
import useStyles from './styles';

/**
 *
 * @param {Function} param.calculateDateRangeList - must return an array of objects with following keys: year, from, to
 * @param {Function} param.callback - to do API requests using from and to parameters.
 * @returns
 */
function YearSelector({ from, moveBack, moveForward }) {
  const classes = useStyles();

  return (<div className={classes.buttons} >
    <IconButton aria-label="back" className={classes.margin} size="small" onClick={moveBack}>
      <ArrowBackIcon fontSize="inherit" />
    </IconButton>
    <span>{from ? dayjs(from, 'YYYY-MM-DD').format('YYYY') : 'loading...'}</span>
    <IconButton aria-label="forward" className={classes.margin} size="small" onClick={moveForward}>
      <ArrowForwardIcon fontSize="inherit" />
    </IconButton>
  </div>);
}

YearSelector.propTypes = {
  from: PropTypes.string,
  moveBack: PropTypes.func,
  moveForward: PropTypes.func
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

export default connect(mapStateToProps)(withIsMobile(YearSelector));