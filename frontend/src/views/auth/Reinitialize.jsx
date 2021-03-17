import React, { Component } from 'react';
import { FaLock } from 'react-icons/fa';
import { Redirect } from 'react-router-dom';

import { update } from '../../API';

export default class Settings extends Component {
  constructor() {
    super();

    this.state = {
      password: '',
      error: '',
      isReinitialized: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { password } = this.state;

    // Verify password error.
    let error = '';

    if (password.length < 8) {
      error = 'Votre mot de passe doit contenir au moins 8 caractères.';
    } else if (password.length > 50) {
      error = 'Votre mot de passe ne doit pas contenir plus de 50 caractères.';
    }

    if (error) {
      this.setState({ error });
      return;
    }

    // Server-size reinitialization.
    const { token } = this.props.match.params;
    const res = await update(token, { password });
    if (res.error) {
      this.setState({ error: 'Token invalide.' });
      return;
    }
    this.setState({ isReinitialized: true });
  };

  render() {
    if (this.state.isReinitialized) {
      return (
        <Redirect
          to={{
            pathname: '/auth/login',
            state: {
              notification: {
                message: 'Votre mot de passe est réinitialisé.',
                status: 'success',
              },
            },
          }}
        />
      );
    }

    return (
      <form onSubmit={this.handleSubmit} className='container'>
        <h1 className='title'>Réinitialisation du mot de passe</h1>

        <div className='field'>
          <label className='label' htmlFor='password'>
            Nouveau mot de passe
          </label>
          <div className='control has-icons-left'>
            <input
              className={this.state.error ? 'input is-danger' : 'input'}
              type='password'
              name='password'
              id='password'
              placeholder='••••••••'
              onChange={this.handleChange}
            />
            <span className='icon is-small is-left'>
              <FaLock />
            </span>
          </div>
          {this.state.error && (
            <p className='help is-danger'>{this.state.error}</p>
          )}
        </div>
        <input className='button is-link' type='submit' />
      </form>
    );
  }
}
