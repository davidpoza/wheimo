import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// material ui
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// own
import Avatar from '../avatar';
import useStyles from './styles';

function MyAppBar() {
  const classes = useStyles();
  const location = useLocation();

  function getTitle() {
    switch (location.pathname) {
      case '/tags':
        return 'Tags & Rules';
      case '/accounts':
        return 'Accounts';
      default:
        return 'Transactions';
    }
  }

  return (
    <AppBar position="fixed" className={classes.appBar} >
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          <span title="Where is my money?" className={classes.appName}>
            whei<span className={classes.appNameColored}>MO?</span>
          </span>
          {getTitle()}
        </Typography>
        <Avatar />
      </Toolbar>
    </AppBar>
  );
}

MyAppBar.propTypes = {

};

export default MyAppBar;
