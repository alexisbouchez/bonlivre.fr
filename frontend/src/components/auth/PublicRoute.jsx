import { Redirect, Route } from 'react-router-dom';
import { AuthConsumer } from '../../AuthContext';

export default function PublicRoute({ component: Component, ...rest }) {
  return (
    <AuthConsumer>
      {({ token }) => (
        <Route
          {...rest}
          render={(props) =>
            token ? <Redirect to='/search' /> : <Component {...props} />
          }
        />
      )}
    </AuthConsumer>
  );
}
