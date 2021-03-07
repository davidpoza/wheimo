import * as React from 'react';
import Proptypes from 'prop-types';

export default function PopOver({ text }) {
  return (
    <div>
      {text}
    </div>
  );
}

PopOver.propTypes = {
  text: Proptypes.string,
};
