import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ExitIcon from '@material-ui/icons/ExitToApp';
import TagIcon from '@material-ui/icons/LocalOffer';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountIcon from '@material-ui/icons/AccountBalance';
import TransactionIcon from '@material-ui/icons/Receipt';
import ReportIcon from '@material-ui/icons/Assessment';
import Typography from '@material-ui/core/Typography';

import useStyles from './styles';
import { resetState } from '../../actions/user';

function NavMenu({ resetUserState, anchorEl, setAnchorEl }) {
  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    resetUserState();
  };

  return <Menu
    id="simple-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem component={Link} to="/profile" className={classes.menuEmail}>
      <ListItemIcon>
        <PersonIcon className={classes.icon} fontSize="small" />
      </ListItemIcon>
      <Typography>My profile</Typography>
    </MenuItem>

    <MenuItem component={Link} to="/" className={classes.menuEmail}>
      <ListItemIcon>
        <TransactionIcon className={classes.icon} fontSize="small" />
      </ListItemIcon>
      <Typography>Transactions</Typography>
    </MenuItem>

    <MenuItem component={Link} to="/accounts" className={classes.menuEmail}>
      <ListItemIcon>
        <AccountIcon className={classes.icon} fontSize="small" />
      </ListItemIcon>
      <Typography>Accounts</Typography>
    </MenuItem>

    <MenuItem component={Link} to="/tags" className={classes.menuEmail}>
      <ListItemIcon>
        <TagIcon className={classes.icon} fontSize="small" />
      </ListItemIcon>
      <Typography>Tags & Rules</Typography>
    </MenuItem>

    <MenuItem onClick={handleLogout}>
      <ListItemIcon>
          <ExitIcon className={classes.icon} fontSize="small" />
      </ListItemIcon>
      <Typography>Logout</Typography>
    </MenuItem>
  </Menu>
}

const mapDispatchToProps = (dispatch) => ({
  resetUserState: () => dispatch(resetState()),
});

export default connect(null, mapDispatchToProps)(NavMenu);