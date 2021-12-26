import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import useStyles from '../../styles';


function TagList({ user, from, to, callback, tags, checked, handleToggle }) {
  const classes = useStyles();


  return <List className={classes.tagList}>
    {
      tags?.map(t => (
        <ListItem>
          <ListItemText id="switch-list-label-wifi" primary={t.name} />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={handleToggle(t.id, t.name)}
              checked={checked.indexOf(t.name) !== -1}
              inputProps={{ 'aria-labelledby': `switch-list-label-${t.name}` }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))
    }
  </List>
}

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

export default connect(mapStateToProps)(TagList);