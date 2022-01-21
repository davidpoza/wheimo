import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import i18n from 'utils/i18n';

// material ui
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// own
import Avatar from '../avatar';
import useStyles from './styles';
import { openDrawer as openDrawerAction } from '../../actions/ui';

function MyAppBar({ openDrawer, lng }) {
  const classes = useStyles();
  const location = useLocation();

  function getTitle() {
    switch (location.pathname) {
      case '/tags':
        return i18n.t('screensTitles.tagsAndRules', { lng });
      case '/accounts':
        return i18n.t('screensTitles.accounts', { lng });
      case '/heatmap':
        return i18n.t('screensTitles.heatmap', { lng });
      case '/charts':
        return i18n.t('screensTitles.charts', { lng });
      case '/drafts':
        return i18n.t('screensTitles.drafts', { lng });
      default:
        return i18n.t('screensTitles.transactions', { lng });
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

const mapStateToProps = (state) => ({
  lng: state.user?.current?.lang,
});


const mapDispatchToProps = (dispatch) => ({
  openDrawer: () => dispatch(openDrawerAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAppBar);