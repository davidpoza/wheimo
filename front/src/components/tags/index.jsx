import React from 'react';
import PropTypes from 'prop-types';

// own

import useStyles from './styles';

export default function Tags({ tags }) {
  const classes = useStyles();
  if (!tags) return null;
  return (
    <div>
      {
        tags.map((tag, index) => (
          <span key={index} className={classes.chip}>
            {tag.name}
          </span>
        ))
      }
    </div>
  );
}

Tags.propTypes = {
  tags: PropTypes.array,
};
