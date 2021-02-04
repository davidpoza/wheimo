import { Container } from '@material-ui/core';
import React from 'react';

// own
import useStyles from './styles';

export default function Content() {
  const classes = useStyles();

  return (
    <div className={classes.root} >
      contenido
    </div>
  )
}