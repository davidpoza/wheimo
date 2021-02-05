import React from 'react';

// material ui
import { makeStyles } from '@material-ui/core/styles';


const withViewStyles = (Component) => ({ isMobile, ...props }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: isMobile ? 0 : '2em',
      height: '80%',
      display: 'flex',
      flexDirection: 'column'
    },
  }));
  const classes = useStyles();
  return (
    <Component {...props} viewClasses={classes.root} />
  )
}

export default withViewStyles;