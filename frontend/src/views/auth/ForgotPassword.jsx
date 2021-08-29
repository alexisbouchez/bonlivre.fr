import React, { Component } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { isEmail } from 'validator'

import { sendReinitializationEmail } from '../../API'

export default class ForgotPassword extends Component {
  state = {
    email: '',
    error: '',
    isEmailSent: false
  }

  handleChange = (event) => {
    const { name, value } = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const { email } = this.state
    if (!isEmail(email)) {
      this.setState({ error: 'Adresse électronique invalide.' })
      return
    }

    const res = await sendReinitializationEmail(email)
    const { error } = res
    if (error) {
      this.setState({ error: 'Adresse électronique invalide.' })
      return
    }

    this.setState({ isEmailSent: true })
  }

  render() {
    if (this.state.isEmailSent) {
      return (
        <section className='hero is-success'>
          <div className='hero-body'>
            <div className='container'>
              <h2 className='subtitle'>
                Un courrier électronique vous a été envoyé, contenant un lien
                permettant de réinitialiser votre mot de passe.
              </h2>
            </div>
          </div>
        </section>
      )
    }

    return (
      <form
        onSubmit={this.handleSubmit}
        className='section container is-fullheight'
      >
        <h1 className='title'>Mot de passe oublié</h1>
        <div className='field'>
          <label className='label' htmlFor='email'>
            Adresse électronique
          </label>
          <div className='control has-icons-left'>
            <input
              className={this.state.error ? 'input is-danger' : 'input'}
              type='email'
              name='email'
              id='email'
              placeholder='jean.dupont@gmail.com'
              onChange={this.handleChange}
            />
            <span className='icon is-small is-left'>
              <FaEnvelope />
            </span>
          </div>
          {this.state.error && (
            <p className='help is-danger'>{this.state.error}</p>
          )}
        </div>

        <div className='field'>
          <input className='button is-link' type='submit' />
        </div>
      </form>
    )
  }
}
