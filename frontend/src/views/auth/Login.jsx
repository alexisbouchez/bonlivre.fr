import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import validator from 'validator';
import { FaEnvelope, FaLock } from 'react-icons/fa';

import Notification from '../../components/Notification';
import AuthContext from '../../AuthContext';
import { login } from '../../API';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: '',
      isLoggedIn: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  handleChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;

    // Short verifications
    if (!validator.isEmail(email)) {
      this.setState({ error: 'Identifiants invalides.' });
      return;
    }

    if (password.length < 8) {
      this.setState({ error: 'Identifiants invalides.' });
      return;
    }

    // Server-side logging.
    const res = await login(email, password);
    const { error } = res;
    if (error) {
      if (error.includes('confirmed')) {
        this.setState({ error: 'Veuillez confirmer votre compte.' });
      } else {
        this.setState({ error: 'Identifiants invalides.' });
      }

      return;
    }

    this.context.updateToken(res.token);
    this.setState({ isLoggedIn: true });
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to='/board' />;
    }

    let notification;
    try {
      notification = this.props.location.state.notification;
    } catch (err) {
      notification = false;
    }

    return (
      <>
        {notification && (
          <Notification status={notification.status}>
            {notification.message}
          </Notification>
        )}

        <form
          autoComplete='off'
          onSubmit={(e) => {
            this.handleSubmit(e);
          }}
          className='section container'
        >
          <h1 className='title'>Connexion</h1>

          <div className='field'>
            <label className='label' htmlFor='email'>
              Adresse électronique
            </label>

            <div className='control has-icons-left'>
              <input
                className={this.state.error ? 'input is-danger' : 'input'}
                id='email'
                type='email'
                name='email'
                placeholder='jean.dupont@gmail.com'
                onChange={this.handleChange}
              />

              <span className='icon is-small is-left'>
                <FaEnvelope />
              </span>
            </div>
          </div>

          <div className='field'>
            <label className='label' htmlFor='password'>
              Mot de passe
            </label>

            <div className='control has-icons-left'>
              <input
                className={this.state.error ? 'input is-danger' : 'input'}
                id='password'
                type='password'
                name='password'
                placeholder='••••••••'
                onChange={this.handleChange}
              />
              <span className='icon is-small is-left'>
                <FaLock />
              </span>
            </div>
          </div>

          {this.state.error && (
            <p className='help is-danger'>{this.state.error}</p>
          )}

          <div className='field'>
            <Link to='/auth/reinitialize-password'>Mot de passe oublié ?</Link>
          </div>

          <div className='field'>
            <input type='submit' className='button is-link' value='Envoyer' />
          </div>

          <p>
            Pas encore enregistré ?{' '}
            <Link to='/auth/signup'>Inscrivez-vous.</Link>
          </p>
        </form>
      </>
    );
  }
}

Login.contextType = AuthContext;
