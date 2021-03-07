import React from 'react';
import PropTypes from 'prop-types';

// own
import useStyles from './styles';

export default function Content(props) {
  const classes = useStyles();

  return (
    <div className={classes.root} >
      {props.children}
    </div>
  );
}

Content.propTypes = {
  children: PropTypes.node.isRequired,
};
