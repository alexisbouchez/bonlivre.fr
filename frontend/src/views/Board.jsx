import React, { Component } from 'react'

import { getShelf } from '../API'
import AuthContext from '../AuthContext'

import BookCard from '../components/BookCard'

export default class Board extends Component {
  static contextType = AuthContext

  state = {
    error: '',
    booksRead: [],
    booksReading: [],
    booksToRead: [],
    isLoaded: false
  }

  async componentDidMount() {
    const res = await getShelf(this.context.token)
    this.setState(res)
    this.setState({ isLoaded: true })
  }

  render() {
    const { booksRead, booksReading, booksToRead, isLoaded } = this.state

    if (!isLoaded) {
      return <div></div>
    }

    return (
      <div className='is-fullheight section container'>
        <div>
          <h1 className='title is-2 has-text-success'>Déjà lu</h1>

          <div className='columns is-multiline is-mobile'>
            {booksRead.map((book, key) => (
              <BookCard
                css='column is-half-desktop is-full-mobile is-full-tablet'
                key={key}
                id={book._id}
                title={book.title}
                author={book.author}
                publicationDate={book.publicationDate}
              />
            ))}
          </div>
        </div>

        <hr />

        <div>
          <h1 className='title is-2 has-text-info'>En train de lire</h1>
          <div className='columns is-multiline is-mobile'>
            {booksReading.map((book, index) => (
              <BookCard
                css='column is-half-desktop is-full-mobile is-full-tablet'
                key={index}
                id={book._id}
                title={book.title}
                author={book.author}
                publicationDate={book.publicationDate}
              />
            ))}
          </div>
        </div>

        <hr />

        <div>
          <h1 className='title is-2 has-text-primary'>À lire</h1>
          <div className='columns is-multiline is-mobile'>
            {booksToRead.map((book, index) => (
              <BookCard
                css='column is-half-desktop is-full-mobile is-full-tablet'
                key={index}
                id={book._id}
                title={book.title}
                author={book.author}
                publicationDate={book.publicationDate}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}
