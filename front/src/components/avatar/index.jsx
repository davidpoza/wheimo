import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';
import Avatar from '@material-ui/core/Avatar';

// own
import NavMenu from 'components/menu';
import SettingsDialog from 'components/settings-dialog';
import {
  settingsDialogOpen as openAction,
  settingsDialogClose as closeAction,
} from '../../actions/user';
import usePushNotifications from '../../hooks/use-push-notification';
import config from '../../utils/config';
import useStyles from './styles';

function MyAvatar({ user, openSettingsDialog }) {
  const { userSubscription } = usePushNotifications(user?.token);
  const classes = useStyles();

  const handleClick = (event) => {
    openSettingsDialog();
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
        <NavMenu />
        <SettingsDialog />
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
  openSettingsDialog: () => {
    dispatch(openAction());
  },
  close: () => {
    dispatch(closeAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAvatar);
