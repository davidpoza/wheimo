import React, {useState} from 'react';

// material ui
import Snackbar from '@material-ui/core/Snackbar';

// own
import Loader from '../components/loader';

const withLoader = (Component) => ({loading, error, errorMessage, cleanErrors, ...rest}) => {
  return (
    <>
      {
        errorMessage &&
        <Snackbar
          style={{zIndex: 999999}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          onClose={() => { if (cleanErrors) cleanErrors(); }}
          open={errorMessage}
          autoHideDuration={3000}
          message={errorMessage}
        />
      }

      {
        loading &&
        <Loader />
      }
      <Component {...rest} />
    </>
  )
}

export default withLoader;