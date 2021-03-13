import * as React from 'react';
import PropTypes from 'prop-types';

export default function PopOver({ text }) {
  return (
    <div>
      {text}
    </div>
  );
}

PopOver.propTypes = {
  text: PropTypes.string,
};
