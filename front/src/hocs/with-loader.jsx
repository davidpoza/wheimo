import React from 'react';

// own
import Loader from '../components/loader';

/* eslint-disable react/prop-types */
const withLoader = (Component) => ({
  loading, ...rest
}) => {
  return (
    <>
      {loading && <Loader />}
      <Component {...rest} />
    </>
  );
};

export default withLoader;
