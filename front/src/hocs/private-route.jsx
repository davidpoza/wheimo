import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  user,
  ...others
 }) => {
console.log("---->",user)
  return (
      <Route
        {...others}
        render={(props) =>
          user
            ? <Component {...props} />
            : <Redirect
              to={{
                pathname: '/login',
              }}
              />
        }
      />
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.current,
  }
}

export default connect(mapStateToProps)(PrivateRoute);