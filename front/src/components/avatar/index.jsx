import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

// material ui
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ExitIcon from '@material-ui/icons/ExitToApp';
import Typography from '@material-ui/core/Typography';

// own
import usePushNotifications from '../../hooks/use-push-notification';
import { resetState } from '../../actions/user';
import config from '../../utils/config';
import useStyles from './styles';

function MyAvatar({ user, resetUserState }) {
  const { userSubscription } = usePushNotifications(user?.token);
  console.log('--->', userSubscription);
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

  // eslint-disable-next-line max-len
  const url = get(user, 'avatar.url', 'https://reactify.api.davidinformatico.com/uploads/9b17726ba32542224909596cf182bcb7_ab511f16b9.jpeg');

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

MyAvatar.propTypes = {
  user: PropTypes.object,
  resetUserState: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current || null,
});

const mapDispatchToProps = (dispatch) => ({
  resetUserState: () => dispatch(resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAvatar);
