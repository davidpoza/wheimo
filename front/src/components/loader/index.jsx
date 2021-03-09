import React from 'react';

// material ui
import CircularProgress from '@material-ui/core/CircularProgress';

// own
import useStyles from './styles';

function Loader() {
  const classes = useStyles();
  return <CircularProgress className={classes.loader} />;
}

export default Loader;
