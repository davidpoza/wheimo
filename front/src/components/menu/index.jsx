import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ExitIcon from '@material-ui/icons/ExitToApp';
import TagIcon from '@material-ui/icons/LocalOffer';
import CreateIcon from '@material-ui/icons/Create';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccountIcon from '@material-ui/icons/AccountBalance';
import TransactionIcon from '@material-ui/icons/Receipt';
import BarChart from '@material-ui/icons/BarChart';

import i18n from 'utils/i18n';
import useStyles from './styles';
import { resetState } from '../../actions/user';
import { closeDrawer as closeDrawerAction } from '../../actions/ui';

function NavMenu({ resetUserState, drawerOpen, closeDrawer, lng }) {
  const classes = useStyles();

  const handleLogout = () => {
    closeDrawer();
    resetUserState();
  };

  const list = (anchor) => (
    <Box
      role="presentation"
    >
      <List className={classes.list}>
        <ListItem button key='transactions' component={Link} to="/" onClick={closeDrawer}>
          <ListItemIcon className={classes.icon}>
            <TransactionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={i18n.t('menu.transactions', { lng })} />
        </ListItem>

        <ListItem>
          <List component="div" disablePadding>
            <ListItem button key='drafts' component={Link} to="/drafts" onClick={closeDrawer}>
              <ListItemIcon className={classes.icon}>
                <CreateIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={i18n.t('menu.drafts', { lng })} />
            </ListItem>

            <ListItem button key='heatmap' component={Link} to="/heatmap" onClick={closeDrawer}>
              <ListItemIcon className={classes.icon}>
                <DateRangeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={i18n.t('menu.heatmap', { lng })} />
            </ListItem>

            <ListItem button key='chart' component={Link} to="/charts" onClick={closeDrawer}>
              <ListItemIcon className={classes.icon}>
                <BarChart fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={i18n.t('menu.charts', { lng })} />
            </ListItem>
          </List>
        </ListItem>

        <ListItem button key='accounts' component={Link} to="/accounts" onClick={closeDrawer}>
          <ListItemIcon className={classes.icon}>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={i18n.t('menu.accounts', { lng })} />
        </ListItem>

        <ListItem button key='tags' component={Link} to="/tags" onClick={closeDrawer}>
          <ListItemIcon className={classes.icon}>
            <TagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={i18n.t('menu.tags', { lng })} />
        </ListItem>

        <ListItem button key='logout' onClick={handleLogout}>
          <ListItemIcon className={classes.icon}>
            <ExitIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={i18n.t('menu.logout', { lng })} />
        </ListItem>
      </List>
    </Box>
  );

  return <Drawer
    variant="temporary"
    anchor="left"
    open={drawerOpen}
    onClose={closeDrawer}
  >
    {list()}
  </Drawer>
}

const mapStateToProps = (state) => ({
  drawerOpen: state.ui.drawerOpen,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  resetUserState: () => dispatch(resetState()),
  closeDrawer: () => dispatch(closeDrawerAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);