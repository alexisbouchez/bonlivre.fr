import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import { getBooks } from '../API';
import AuthContext from '../AuthContext';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';

const genres = [
  'Art',
  'Biographie',
  'Bande dessinée',
  'Classique',
  'Développement personnel',
  'Ésotérisme',
  'Fiction',
  'Fantastique',
  'Histoire',
  'Musique',
  'Manuel',
  'Poésie',
  'Policier',
  'Philosophie',
  'Politique',
  'Psychologie',
  'Religion',
  'Science-fiction',
  'Science',
];

export default class Search extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    let search;
    try {
      search = props.location.state.search;
    } catch (err) {
      search = '';
    }

    this.state = {
      fields: {
        genre: '',
        search,
        page: 1,
        filter: 'recent',
      },
      error: '',
      books: false,
      numberOfPages: 1,
    };
  }

  handleSearchChange = (e) => {
    const { fields } = this.state;
    fields.search = e.target.value;
    this.setState({ fields });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.setBooks();
  };

  setBooks = async () => {
    const { fields } = this.state;
    const { token } = this.context;
    const res = await getBooks(fields, token);
    const { error, books, numberOfPages } = res;
    this.setState({
      error: error || '',
      books: books || [],
      numberOfPages: numberOfPages || 1,
    });
  };

  setGenre = (genre) => {
    const { fields } = this.state;
    fields.genre = genre;
    this.setState({ fields });
    this.setBooks();
  };

  setPage = (page) => {
    const { fields } = this.state;
    fields.page = page;
    this.setState({ fields });
    this.setBooks();
  };

  setFilter = (filter) => {
    const { fields } = this.state;
    fields.filter = filter;
    this.setState({ fields });
    this.setBooks();
  };

  componentDidMount() {
    this.setBooks();
  }

  render() {
    const { books, fields } = this.state;
    const { page } = this.state.fields;
    const { numberOfPages } = this.state;

    if (!numberOfPages) return <div></div>;

    return (
      <div className='columns'>
        <div className='column is-one-fifth is-hidden-mobile'>
          <div className='genres'>
            <div className='genre'>
              <p>
                <b>Genres</b>
              </p>
            </div>

            <div
              className={
                fields.genre === ''
                  ? 'genre is-active pointer'
                  : 'genre pointer'
              }
              onClick={() => this.setGenre('')}
            >
              <p>Tous</p>
            </div>

            {genres.map((genre, key) => (
              <div
                className={
                  fields.genre === genre
                    ? 'genre is-active pointer'
                    : 'genre pointer'
                }
                key={key}
                onClick={() => this.setGenre(genre)}
              >
                <p>{genre}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='column books-search'>
          <div className='main'>
            <form onSubmit={this.handleSearchSubmit}>
              <br />
              <div className='control has-icons-left'>
                <input
                  className='input is-large'
                  name='search'
                  type='text'
                  placeholder='Trouver un livre'
                  value={this.state.fields.search}
                  onChange={this.handleSearchChange}
                />
                <span className='icon is-left'>
                  <FaSearch />
                </span>
              </div>
            </form>

            <br />

            <div className='tabs'>
              <ul>
                <li
                  onClick={() => this.setFilter('recent')}
                  className={fields.filter === 'recent' ? 'is-active' : ''}
                >
                  {/* eslint-disable-next-line */}
                  <a>Mis à jour récemment</a>
                </li>
                <li
                  onClick={() => this.setFilter('publicationDate')}
                  className={
                    fields.filter === 'publicationDate' ? 'is-active' : ''
                  }
                >
                  {/* eslint-disable-next-line */}
                  <a>Publié récemment</a>
                </li>
                <li
                  onClick={() => this.setFilter('score')}
                  className={fields.filter === 'score' ? 'is-active' : ''}
                >
                  {/* eslint-disable-next-line */}
                  <a>Meilleur score</a>
                </li>
              </ul>
            </div>

            <div className='book-shelf'>
              <div className='columns is-multiline is-mobile'>
                {books && books.length < 1 && (
                  <h1 className='title has-text-danger'>Aucun livre trouvé</h1>
                )}

                {books &&
                  books.map((book, index) => (
                    <BookCard
                      css='column is-half-desktop is-full-mobile is-full-tablet box'
                      key={index}
                      id={book._id}
                      title={book.title}
                      author={book.author}
                      publicationDate={book.publicationDate}
                    />
                  ))}
              </div>
              {this.context.token && page === numberOfPages && (
                <p>
                  Vous ne trouvez pas un livre ?{' '}
                  <Link to={'/submit-book'}>Ajoutez-en un.</Link>
                </p>
              )}
            </div>
          </div>

          <Pagination
            page={page}
            numberOfPages={numberOfPages}
            setPage={this.setPage}
          />
        </div>
      </div>
    );
  }
}
