import React, { Component } from 'react';
import Cookies from 'js-cookie';

const AuthContext = React.createContext();

export class AuthProvider extends Component {
  state = {
    token: Cookies.get('token') || '',
  };

  updateToken = (token) => {
    this.setState({ token });
    Cookies.set('token', token, { expires: 365 });
  };

  render() {
    const value = {
      token: this.state.token,
      updateToken: this.updateToken,
    };

    return (
      <AuthContext.Provider value={value}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export const AuthConsumer = AuthContext.Consumer;

export default AuthContext;
