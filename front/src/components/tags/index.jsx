import * as React from 'react';
import Proptypes from 'prop-types';

export default function Tags({ tags }) {
  if (!tags) return null;
  return (
    <div>
      {
        tags.map((tag) => {
          return (
            <span>
              {tag.name}
            </span>
          );
        })
      }

    </div>
  );
}

Tags.propTypes = {
  tags: Proptypes.array,
}
