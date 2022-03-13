import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

import withIsMobile from 'hocs/with-is-mobile.jsx';
import useStyles from './styles';

function MyCheckbox({ isMobile, checked, onClick, labelId }) {
  const classes = useStyles();
  if (isMobile) {
    return <div
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      className={checked ? classes.checked : classes.unchecked}>
    </div>
  }
  return <Checkbox
    edge="start"
    checked={checked}
    onClick={(e) => {
      if (onClick) {
        e.stopPropagation();
        onClick();
      }
    }}
    tabIndex={-1}
    disableRipple
    inputProps={{'aria-labelledby': labelId}}
  />;
}

export default withIsMobile(MyCheckbox);

MyCheckbox.propTypes = {
  isMobile: PropTypes.bool,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
}