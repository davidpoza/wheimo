import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const PrivateRoute = ({
  component: Component,
  user,
  ...others
 }) => {

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

export default PrivateRoute;