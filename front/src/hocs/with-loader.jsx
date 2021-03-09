import React from 'react';

// material ui
import Snackbar from '@material-ui/core/Snackbar';

// own
import Loader from '../components/loader';

/* eslint-disable react/prop-types */
const withLoader = (Component) => ({
  loading, error, errorMessage, ...rest
}) => (
    <>
      {
        errorMessage
          && <Snackbar
          style={{ zIndex: 999999 }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={errorMessage}
          autoHideDuration={3000}
          message={errorMessage}
        />
      }

      {
        loading && <Loader />
      }
      <Component {...rest} />
    </>
);

export default withLoader;
