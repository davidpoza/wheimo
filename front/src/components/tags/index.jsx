import React from 'react';
import Proptypes from 'prop-types';

export default function Tags({ tags }) {
  if (!tags) return null;
  return (
    <div>
      {
        tags.map((tag, index) => (
          <span key={index}>
            {tag.name}
          </span>
        ))
      }
    </div>
  );
}

Tags.propTypes = {
  tags: Proptypes.array,
};
