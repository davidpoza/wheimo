import React from 'react';
import PropTypes from 'prop-types';

export default function ConditionalWrapper({
  children,
  condition,
  ElementType = 'div',
  ...moreProps
}) {
  if (condition) {
    return (
      <ElementType {...moreProps}>
        {children}
      </ElementType>
    );
  }

  return (
    <>
    {children}
    </>
  );
}

ConditionalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  condition: PropTypes.bool,
  ElementType: PropTypes.elementType,
};
