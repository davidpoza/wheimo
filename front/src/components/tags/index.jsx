import React from 'react';
import PropTypes from 'prop-types';

// own
import withIsMobile from 'hocs/with-is-mobile.jsx';
import useStyles from './styles';

function Tags({ tags, handleChangeFilter, isMobile }) {
  const classes = useStyles();
  if (!tags) return null;

  const handleOnClick = (e, index) => {
    e.stopPropagation();
    if (handleChangeFilter) handleChangeFilter({ tags: [tags[index]] });
  };

  return (
    <div>
      {
        tags
        .slice(0, isMobile ? 3 : 6)
        .map((tag, index) => (
          <span key={index} className={classes.chip} onClick={(e) => handleOnClick(e, index)}>
            {isMobile ? `${tag?.name?.substr(0,6)}${tag?.name?.length > 6 ? '…': ''}` : tag.name}
          </span>
        ))
      }
    </div>
  );
}

export default withIsMobile(Tags);

Tags.propTypes = {
  tags: PropTypes.array,
};
