import React, { useState } from 'react';

// material ui
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

// own
import Loader from '../components/loader';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(14),
  },
  success: {
    backgroundColor: "#66bb6a"
  },
  error: {
    backgroundColor: "#e91e63"
  }
}));

/* eslint-disable react/prop-types */
const withLoader = (Component) => ({
  loading, error, errorMessage, successMessage, ...rest
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  return (
    <>
      {(errorMessage || successMessage) && (
        <Snackbar
          className={classes.root}
          style={{zIndex: 999999}}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={3000}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Alert
            className={error ? classes.error : classes.success}
            severity={error ? 'error' : 'success'}
            sx={{width: '100%'}}>
            {error ? errorMessage : successMessage}
          </Alert>
        </Snackbar>
      )}

      {loading && <Loader />}
      <Component {...rest} />
    </>
  );
};

export default withLoader;
