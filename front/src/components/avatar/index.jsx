import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash.get';
import PropTypes from 'prop-types';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ExitIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';

// own
import { resetState as resetUserState } from '../../actions/user';
import config from '../../utils/config';
import useStyles from './styles';

function MyAvatar(props) {
  const { user, resetUserState, url } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    resetUserState();
  };

  if (user) {
    return (
      <>
        <Avatar
          onClick={handleClick}
          className={classes.avatar}
          src={`${config.API_HOST}${url}`}
        />
        <span onClick={handleClick} className={classes.username}>{get(user, 'email')}</span>
        <Menu
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

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
                <ExitIcon className={classes.icon} fontSize="small" />
            </ListItemIcon>
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </>
    );
  }
  return (null);
}


const mapStateToProps = (state) => {
  return {
    user: state.user.current || null,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    resetUserState: () => dispatch(resetUserState()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAvatar);

MyAvatar.propTypes = {
  url: PropTypes.string,
};
