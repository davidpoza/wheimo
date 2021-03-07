import React from 'react';
import PropTypes from 'prop-types';

// material ui
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// own
import Avatar from '../avatar';
import useStyles from './styles';

function MyAppBar({ handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar} >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
        </Typography>
        <Avatar />
      </Toolbar>
    </AppBar>
  );
}

MyAppBar.propTypes = {
  handleDrawerToggle: PropTypes.func,
};

export default MyAppBar;
