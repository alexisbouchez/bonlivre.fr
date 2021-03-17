import React, { Component } from 'react';
import { sendComment } from '../API';

export default class Comment extends Component {
  state = {
    comment: '',
    error: '',
    hasCommented: false,
  };

  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleSubmit = async (token) => {
    const { comment } = this.state;
    const { id, stars } = this.props;

    if (comment.length < 10) {
      this.setState({
        error: 'Le commentaire doit comporter au moins 10 caractères.',
      });
      return;
    }

    if (comment.length > 1000) {
      this.setState({
        error: 'Le commentaire ne doit pas comporter plus de 1000 caractères.',
      });
      return;
    }

    const res = await sendComment(id, token, comment);

    const { error } = res;

    if (error) {
      if (error === 'Already commented.') {
        this.setState({ error: 'Vous avez déjà commenté ce livre.' });
      } else {
        this.setState({ error: 'Erreur interne.' });
      }

      return;
    }

    this.setState({ hasCommented: true });
    this.props.insert({
      comment,
      username: 'Moi',
      isOwned: true,
      stars: stars > 0 ? stars : undefined,
    });
  };

  render() {
    const { error } = this.state;
    const { token } = this.props;

    return (
      <article className='media'>
        <div className='media-content'>
          <div className='field'>
            <p className='control'>
              <textarea
                className={error ? 'textarea is-danger' : 'textarea'}
                placeholder='Ajouter un commentaire'
                value={this.state.comment}
                onChange={this.handleChange}
                disabled={!token}
              ></textarea>
            </p>
          </div>
          {error && (
            <div className='content'>
              <p className='help is-danger'>{error}</p>
            </div>
          )}
          <nav className='level'>
            <div className='level-left'>
              <div className='level-item'>
                <button
                  className='button is-link'
                  disabled={!token}
                  onClick={() => this.handleSubmit(token)}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </nav>
        </div>
      </article>
    );
  }
}
