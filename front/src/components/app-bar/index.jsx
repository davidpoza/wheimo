import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { openDrawer as openDrawerAction } from '../../actions/ui';

function MyAppBar({ openDrawer }) {
  const classes = useStyles();
  const location = useLocation();

  function getTitle() {
    switch (location.pathname) {
      case '/tags':
        return 'Tags & Rules';
      case '/accounts':
        return 'Accounts';
      case '/heatmap':
        return 'Expenses heatmap';
      default:
        return 'Transactions';
    }
  }

  return (
    <AppBar position="fixed" className={classes.appBar} >
      <Toolbar>
        <div className={classes.block}>
          <MenuIcon fontSize="large" onClick={openDrawer} />
          <Typography variant="h6" noWrap className={classes.title}>
            <span title="Where is my money?" className={classes.appName}>
              whei<span className={classes.appNameColored}>MO?</span>
            </span>
            {getTitle()}
          </Typography>
        </div>
        <Avatar />
      </Toolbar>
    </AppBar>
  );
}

MyAppBar.propTypes = {

};

const mapDispatchToProps = (dispatch) => ({
  openDrawer: () => dispatch(openDrawerAction()),
});

export default connect(null, mapDispatchToProps)(MyAppBar);