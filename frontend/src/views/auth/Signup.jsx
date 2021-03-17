import React, { Component } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Redirect, Link } from 'react-router-dom';
import { isEmail } from 'validator';

import { signup } from '../../API';

export default class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      username: '',
      password: '',
      isSignedUp: false,
      errors: {},
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

    let errors = {};
    const { email, username, password } = this.state;

    // Check email errors.
    if (!isEmail(email)) {
      errors.email = 'L`adresse électronique est invalide.';
    } else {
      errors.email = undefined;
    }

    // Check username errors.
    if (username.length < 6) {
      errors.username =
        "Votre nom d'utilisateur doit contenir au moins 6 caractères.";
    } else if (username.length > 50) {
      errors.username =
        "Votre nom d'utilisateur ne doit pas contenir plus de 50 caractères.";
    } else {
      errors.username = undefined;
    }

    // Check password errors.
    if (password.length < 8) {
      errors.password =
        'Votre mot de passe doit contenir au moins 8 caractères.';
    } else if (password.length > 255) {
      errors.password =
        'Votre mot de passe ne doit pas contenir plus de  256 caractères.';
    } else {
      errors.password = undefined;
    }

    // Check server-side errors.
    let isSignedUp = false;

    if (Object.keys(errors).every((key) => errors[key] === undefined)) {
      const res = await signup(email, username, password);

      if (res.error) {
        if (res.error.includes('Username')) {
          errors.username = "Le nom d'utilisateur est déjà utilisé.";
        } else if (res.error.includes('Email')) {
          errors.email = "L'adresse électronique est déjà utilisée.";
        } else {
          errors.email = undefined;
          errors.server = 'Erreur interne.';
        }
      } else {
        errors = {};
        isSignedUp = true;
      }
    }

    // Set state
    this.setState({ errors, isSignedUp });
  }

  render() {
    if (this.state.isSignedUp) {
      return (
        <Redirect
          to={{
            pathname: '/auth/login',
            state: {
              notification: {
                message:
                  'Vous êtes inscrit. Avant de vous connecter, confirmez votre compte en cliquant sur le lien envoyé par courriel.',
                status: 'success',
              },
            },
          }}
        />
      );
    }

    const { errors } = this.state;

    return (
      <form
        autoComplete='off'
        onSubmit={this.handleSubmit}
        className='section container'
      >
        <h1 className='title'>Inscription</h1>

        <div className='field'>
          <label className='label' htmlFor='email'>
            Adresse électronique
          </label>

          <div className='control has-icons-left'>
            <input
              className={errors.email ? 'input is-danger' : 'input'}
              id='email'
              type='email'
              name='email'
              placeholder='jean.dupont@gmail.com'
              onChange={this.handleChange}
              value={this.state.email}
            />

            <span className='icon is-small is-left'>
              <FaEnvelope />
            </span>
          </div>

          {errors.email && <p className='help is-danger'>{errors.email}</p>}
        </div>

        <div className='field'>
          <label className='label' htmlFor='username'>
            Nom d'utilisateur
          </label>

          <div className='control has-icons-left'>
            <input
              className={errors.username ? 'input is-danger' : 'input'}
              id='username'
              type='text'
              name='username'
              placeholder='Jean Dupont'
              value={this.state.username}
              onChange={this.handleChange}
            />

            <span className='icon is-small is-left'>
              <FaUser />
            </span>
          </div>
          {errors.username && (
            <p className='help is-danger'>{errors.username}</p>
          )}
        </div>

        <div className='field'>
          <label className='label' htmlFor='password'>
            Mot de passe
          </label>

          <div className='control has-icons-left'>
            <input
              id='password'
              className={errors.password ? 'input is-danger' : 'input'}
              type='password'
              name='password'
              placeholder='••••••••'
              onChange={this.handleChange}
            />

            <span className='icon is-small is-left'>
              <FaLock />
            </span>
          </div>
          {errors.password && (
            <p className='help is-danger'>{errors.password}</p>
          )}
        </div>
        {errors.server && <p className='help is-danger'>{errors.server}</p>}

        <div className='field'>
          <input className='button is-link' type='submit' value='Envoyer' />
        </div>

        <p>
          Déjà inscrit ? <Link to='/auth/login'>Connectez-vous.</Link>
        </p>
      </form>
    );
  }
}
