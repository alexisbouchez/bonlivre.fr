import React, { Component } from 'react'

import { confirm } from '../../API'

export default class Confirm extends Component {
  state = {
    isConfirmed: false,
    error: ''
  }

  async componentDidMount() {
    const { token } = this.props.match.params

    const res = await confirm(token)
    const { error } = res

    if (error) {
      this.setState({ error })
      return
    }

    this.setState({ isConfirmed: true })
  }

  render() {
    const { isConfirmed, error } = this.state

    return (
      <div className='is-fullheight'>
        <section className={`hero is-${error ? 'danger' : 'success'}`}>
          <div className='hero-body'>
            <div className='container'>
              {isConfirmed && (
                <h2 className='subtitle'>
                  Votre adresse électronique est confirmée.
                </h2>
              )}
              {error && <h2 className='subtitle'>{error}</h2>}
            </div>
          </div>
        </section>
      </div>
    )
  }
}
