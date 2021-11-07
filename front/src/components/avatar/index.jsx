import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';
import Avatar from '@material-ui/core/Avatar';

// own
import NavMenu from 'components/menu';
import usePushNotifications from '../../hooks/use-push-notification';
import config from '../../utils/config';
import useStyles from './styles';

function MyAvatar({ user }) {
  const { userSubscription } = usePushNotifications(user?.token);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
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
        <NavMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
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

export default connect(mapStateToProps)(MyAvatar);
