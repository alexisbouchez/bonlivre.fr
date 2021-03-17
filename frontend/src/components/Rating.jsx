import React, { Component } from 'react';
import { FaEdit, FaTimesCircle } from 'react-icons/fa';

import { deleteComment, updateComment } from '../API';
import AuthContext from '../AuthContext';
import StarRating from './StarRating';

export default class Comment extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.state = {
      error: '',
      isInEditMode: false,
      comment: props.comment,
      newComment: props.comment,
    };
  }

  handleDelete = async () => {
    const { ratingId } = this.props;
    const res = await deleteComment(ratingId, this.context.token);
    const { error } = res;
    if (error) {
      this.setState({ error });
      return;
    }
    this.props.delete(ratingId);
  };

  handleChange = (e) => {
    this.setState({ newComment: e.target.value });
  };

  handleToggleEditMode = () => {
    const { isInEditMode, comment } = this.state;
    this.setState({
      isInEditMode: !isInEditMode,
      newComment: comment,
    });
  };

  handleUpdate = async () => {
    const { newComment } = this.state;
    const { ratingId } = this.props;

    if (newComment.length < 10) {
      this.setState({
        error: 'Votre commentaire doit comporter au moins 10 caractères.',
      });
      return;
    }

    if (newComment.length > 1000) {
      this.setState({
        error: 'Votre commentaire ne doit pas dépasser 1000 caractères.',
      });
      return;
    }

    const res = await updateComment(ratingId, this.context.token, newComment);
    const { error } = res;
    if (error) {
      this.setState({ error });
      return;
    }

    this.setState({
      isOwned: true,
      comment: newComment,
      isInEditMode: false,
    });
  };

  render() {
    const { isInEditMode, comment, error } = this.state;
    const { username, isOwned, stars } = this.props;

    return (
      <article className='media box'>
        <div className='media-content'>
          {typeof stars === 'number' && (
            <StarRating stars={stars} token='' id='' />
          )}

          <strong>{username}</strong>

          {isInEditMode && (
            <>
              <textarea
                className={error ? 'textarea is-danger' : 'textarea'}
                placeholder='Modifiez votre commentaire...'
                value={this.state.newComment}
                onChange={this.handleChange}
              />
              {error && <p className='help is-danger'>{error}</p>}
              <button
                className='mt-2 button is-primary'
                onClick={this.handleUpdate}
              >
                Modifier
              </button>
            </>
          )}

          {!isInEditMode && (
            <p className='content' style={{ width: '100%' }}>
              {comment}
            </p>
          )}
        </div>

        {isOwned && (
          <div className='media-right'>
            <span className='icon' onClick={this.handleToggleEditMode}>
              <FaEdit className='has-text-link pointer' />
            </span>
            <span className='icon' onClick={this.handleDelete}>
              <FaTimesCircle className='has-text-danger pointer' />
            </span>
          </div>
        )}
      </article>
    );
  }
}
