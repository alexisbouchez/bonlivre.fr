import React, { Component } from 'react';
import { FaCheck, FaMinus } from 'react-icons/fa';

import { addBookToShelf, getBook } from '../API';
import AuthContext from '../AuthContext';

import NotFound from './NotFound';
import StarRating from '../components/StarRating';
import Ratings from '../components/Ratings';

export default class Book extends Component {
  static contextType = AuthContext;

  state = {
    book: {
      title: '',
      publicationDate: 0,
      author: [],
      genres: [],
    },
    ratings: [],
    inReadList: false,
    inReadingList: false,
    inToReadList: false,
    stars: false,
    score: 0,
    error: '',
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    const data = await getBook(id, this.context.token);
    this.setState(data);
  }

  updateRatings = (newRatings) => {
    this.setState({ ratings: newRatings });
  };

  toggleShowMore = () => {
    const { doesShowMore } = this.state;
    this.setState({ doesShowMore: !doesShowMore });
  };

  handleShelfClick = async (shelf) => {
    const { id } = this.props.match.params;

    const res = await addBookToShelf(this.context.token, id, shelf);

    const { error } = res;
    if (error) {
      this.setState({ error });
      return;
    }

    this.setState({
      inReadList: shelf === 'booksRead',
      inReadingList: shelf === 'booksReading',
      inToReadList: shelf === 'booksToRead',
    });
  };

  setScore = (newScore) => {
    const { book } = this.state;
    book.score = newScore;
    this.setState({ book });
  };

  render() {
    const { id } = this.props.match.params;
    const { token } = this.context;

    const { title, author, publicationDate, score, error } = this.state.book;
    const {
      inReadList,
      inReadingList,
      inToReadList,
      ratings,
      stars,
    } = this.state;

    if (error === 'Book not found.') {
      return <NotFound />;
    }

    if (!title) {
      return <div></div>;
    }

    return (
      <div className='section container'>
        <h1 className='title'>
          {title} ({publicationDate})
        </h1>
        <h2 className='subtitle' style={{ marginBottom: '8px' }}>
          {author}
        </h2>

        {token && (
          <div className='field has-addons'>
            <p className='control'>
              <button
                className='button is-success'
                onClick={() => this.handleShelfClick('booksRead')}
              >
                <span className='icon is-small'>
                  {inReadList && <FaCheck />}
                  {!inReadList && <FaMinus />}
                </span>
                <span>Déjà lu</span>
              </button>
            </p>
            <p className='control'>
              <button
                className='button is-info'
                onClick={() => this.handleShelfClick('booksReading')}
              >
                <span className='icon is-small'>
                  {inReadingList && <FaCheck />}
                  {!inReadingList && <FaMinus />}
                </span>
                <span>En train de lire</span>
              </button>
            </p>
            <p className='control'>
              <button
                className='button is-primary'
                onClick={() => this.handleShelfClick('booksToRead')}
              >
                <span className='icon is-small'>
                  {inToReadList && <FaCheck />}
                  {!inToReadList && <FaMinus />}
                </span>
                <span>À lire</span>
              </button>
            </p>
          </div>
        )}

        <StarRating
          stars={token ? stars : Math.round(score)}
          token={token}
          id={id}
          score={score}
          setScore={this.setScore}
        />

        <Ratings
          stars={stars}
          bookID={id}
          ratings={ratings}
          token={token}
          updateRatings={this.updateRatings}
        />
      </div>
    );
  }
}
