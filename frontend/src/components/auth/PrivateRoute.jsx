import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../../AuthContext';

export default function PublicRoute({ component: Component }) {
  return (
    <AuthConsumer>
      {({ token }) => (
        <Route
          render={(props) =>
            token ? <Component {...props} /> : <Redirect to='/auth/login' />
          }
        />
      )}
    </AuthConsumer>
  );
}
