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
import SettingsIcon from '@material-ui/icons/Settings';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccountIcon from '@material-ui/icons/AccountBalance';
import TransactionIcon from '@material-ui/icons/Receipt';
import ReportIcon from '@material-ui/icons/Assessment';

import useStyles from './styles';
import { resetState } from '../../actions/user';
import { closeDrawer as closeDrawerAction } from '../../actions/ui';

function NavMenu({ resetUserState, drawerOpen, closeDrawer }) {
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
        <ListItem button key='profile' component={Link} to="/profile" onClick={closeDrawer}>
          <ListItemIcon>
            <PersonIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My profile" />
        </ListItem>

        <ListItem button key='transactions' component={Link} to="/" onClick={closeDrawer}>
          <ListItemIcon>
            <TransactionIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>

        <ListItem button key='heatmap' component={Link} to="/heatmap" onClick={closeDrawer}>
          <ListItemIcon>
            <DateRangeIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Heatmap" />
        </ListItem>

        <ListItem button key='accounts' component={Link} to="/accounts" onClick={closeDrawer}>
          <ListItemIcon>
            <AccountIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>

        <ListItem button key='tags' component={Link} to="/tags" onClick={closeDrawer}>
          <ListItemIcon>
            <TagIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Tags & Rules" />
        </ListItem>

        <ListItem button key='logout' onClick={handleLogout}>
          <ListItemIcon>
            <ExitIcon className={classes.icon} fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
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
  drawerOpen: state.ui.drawerOpen
});

const mapDispatchToProps = (dispatch) => ({
  resetUserState: () => dispatch(resetState()),
  closeDrawer: () => dispatch(closeDrawerAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);