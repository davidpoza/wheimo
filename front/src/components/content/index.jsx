import React from 'react';

// own
import useStyles from './styles';

export default function Content(props) {
  const classes = useStyles();

  return (
    <div className={classes.root} >
      {props.children}
    </div>
  )
}