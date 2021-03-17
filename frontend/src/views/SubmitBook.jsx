import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import AuthContext from '../AuthContext';
import { addBook } from '../API';

class AddBook extends Component {
  static contextType = AuthContext;

  state = {
    title: '',
    author: '',
    genres: [],
    genre: '',
    errors: {},
    publicationDate: 0,
    isRedirected: false,
    bookId: '',
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleKeyDown = (e) => {
    if (e.keyCode !== 13) {
      return;
    }

    const { name, value } = e.target;
    const { errors } = this.state;

    if (value.length < 4 || value.length > 50) {
      errors[name] = `${name === 'author' ? 'Auteur' : 'Genre'} invalide.`;
      this.setState({ errors });
      e.preventDefault();
      return;
    } else {
      errors[name] = '';
      this.setState({ errors });
    }

    if (name === 'genre') {
      const { genres } = this.state;

      if (genres.length >= 5) {
        errors.genre = 'Il y a trop de genres saisis.';
        this.setState({ errors });
        e.preventDefault();
        return;
      }

      genres.push(value);
      this.setState({
        genres,
        genre: '',
      });
    }

    e.preventDefault();
  };

  handleClick = (type, value) => {
    if (type === 'genre') {
      const genres = this.state.genres.filter((genre) => genre !== value);
      this.setState({ genres });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { title, author, genres, errors, publicationDate } = this.state;

    if (title.length < 5 || title.length > 60) {
      errors.title = 'Titre invalide.';
    } else {
      errors.title = '';
    }

    if (author.length < 5) {
      errors.author = 'Il manque un auteur.';
    } else {
      errors.author = '';
    }

    if (genres.length < 1) {
      errors.genre = 'Il manque un genre.';
    } else {
      errors.genre = '';
    }

    if (!Number(publicationDate)) {
      errors.publicationDate = 'La date de publication est invalide.';
    } else {
      errors.publicationDate = '';
    }

    let formattedDate;
    try {
      formattedDate = parseInt(publicationDate);
    } catch (err) {
      errors.publicationDate = 'publicationDate invalide.';
    }

    if (
      Object.keys(errors).some((i) => {
        return errors[i] !== '';
      })
    ) {
      return;
    }

    const { token } = this.context;

    const res = await addBook(token, {
      title,
      author,
      genres,
      publicationDate: formattedDate,
    });

    const { error, bookId } = res;

    if (error) {
      if (error === 'Book already found in the database.') {
        errors.other = 'Livre trouvé dans la base de données.';
      } else if (error === 'Unauthorized.') {
        this.context.updateToken('');
        errors.other = 'Non autorisé.';
      } else {
        errors.other = error;
      }
    } else {
      this.setState({
        errors: {},
        isRedirected: true,
        bookId,
      });
    }

    this.setState({ errors });
  };

  render() {
    if (this.state.isRedirected) {
      return <Redirect to={`/book/${this.state.bookId}`} />;
    }

    return (
      <form className='section container' onSubmit={this.handleSubmit}>
        <h1 className='title'>Ajouter un livre</h1>

        <div className='field'>
          <label className='label' htmlFor='title'>
            Titre
          </label>

          <div className='control'>
            <input
              type='text'
              name='title'
              id='title'
              className={this.state.errors.title ? 'input is-danger' : 'input'}
              placeholder='Du côté de chez Swann'
              onChange={this.handleChange}
              autoComplete='off'
            />
          </div>

          {this.state.errors.title && (
            <p className='help is-danger'>{this.state.errors.title}</p>
          )}
        </div>

        <div className='field'>
          <label className='label' htmlFor='publicationDate'>
            Date de publication
          </label>

          <div className='control'>
            <input
              type='number'
              name='publicationDate'
              id='publicationDate'
              className={
                this.state.errors.publicationDate ? 'input is-danger' : 'input'
              }
              placeholder='1913'
              onChange={this.handleChange}
              autoComplete='off'
            />
          </div>

          {this.state.errors.publicationDate && (
            <p className='help is-danger'>
              {this.state.errors.publicationDate}
            </p>
          )}
        </div>

        <div className='field'>
          <label className='label' htmlFor='author'>
            Auteur
          </label>

          <div className='control'>
            <input
              type='text'
              id='author'
              name='author'
              className={this.state.errors.author ? 'input is-danger' : 'input'}
              placeholder='Marcel Proust'
              onChange={this.handleChange}
              value={this.state.author}
              onKeyDown={this.handleKeyDown}
              tabIndex='0'
              autoComplete='off'
            />
          </div>

          {this.state.errors.author && (
            <p className='help is-danger'>{this.state.errors.author}</p>
          )}
        </div>

        <div className='field'>
          <label className='label' htmlFor='genre'>
            Genres
          </label>

          <div className='control'>
            <input
              type='text'
              name='genre'
              id='genre'
              className={this.state.errors.genre ? 'input is-danger' : 'input'}
              placeholder='Roman, Fiction, Classique'
              onChange={this.handleChange}
              value={this.state.genre}
              tabIndex='0'
              onKeyDown={this.handleKeyDown}
              autoComplete='off'
            />
          </div>

          <p className='help'>
            Tapez sur la touche "entrer" une fois le genre saisi.
          </p>

          {this.state.errors.genre && (
            <p className='help is-danger'>{this.state.errors.genre}</p>
          )}

          {this.state.genres.map((genre, key) => (
            <span className='tag is-medium' key={key}>
              {genre}

              <button
                className='delete is-small'
                onClick={() => this.handleClick('genre', genre)}
              />
            </span>
          ))}
        </div>

        {this.state.errors.other && (
          <p className='help is-danger'>{this.state.errors.other}</p>
        )}

        <input
          type='submit'
          className='button is-link'
          onClick={this.handleSubmit}
        />
      </form>
    );
  }
}

export default AddBook;
