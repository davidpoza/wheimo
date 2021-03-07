import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  user,
  ...others
}) => (
  <Route
    {...others}
    render={(props) => (
      user
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/login',
          }}
          />
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

export default connect(mapStateToProps)(PrivateRoute);
