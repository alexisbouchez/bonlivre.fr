import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import Book from '../../models/book-model'
import Rating from '../../models/rating-model'
import Shelf from '../../models/shelf-model'

dotenv.config()

export async function addBook(req, res) {
  const { title, author, publicationDate, genres } = req.body

  // Verify the fields
  if (!title || !author || !publicationDate || !genres) {
    return res.status(400).json({ error: 'Invalid fields.' })
  }

  // Verify if the book already exists.
  const bookFoundByTitleAndAuthors = await Book.findOne({ title, author })

  if (bookFoundByTitleAndAuthors) {
    return res.status(400).json({ error: 'Book already found.' })
  }

  // Add the book
  let bookId

  try {
    const book = await Book.create({
      title,
      author,
      publicationDate,
      genres
    })

    bookId = book.id
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' })
  }

  return res.json({ bookId })
}

export async function getBook(req, res) {
  const { bookId } = req.params

  // Get book.
  let book
  try {
    book = await Book.findById(bookId)
  } catch (err) {
    return res.status(400).json({ error: 'Book not found.' })
  }

  if (!book) {
    return res.status(400).json({ error: 'Book not found.' })
  }

  // Get userId.
  let userId
  const JWT_SECRET = process.env.JWT_SECRET
  try {
    const token = req.headers.authorization.split(' ')[1]
    userId = jwt.verify(token, JWT_SECRET).id
  } catch (err) {
    userId = ''
  }

  // Get ratings.
  let ratings = await Rating.find({
    book: bookId
  }).populate('user')

  let stars
  ratings = ratings.map((rating) => {
    if (rating.user.id.toString() === userId && rating.stars) {
      stars = rating.stars
    }

    return {
      id: rating.id,
      comment: rating.comment,
      stars: rating.stars,
      username: rating.user.username,
      isOwned: rating.user.id.toString() === userId
    }
  })

  ratings = ratings.filter((rating) => !!rating.comment)

  // Get shelf options.
  let inReadList = false
  let inReadingList = false
  let inToReadList = false

  let shelf
  if (userId) {
    shelf = await Shelf.findOne({
      user: userId
    })
  }

  if (shelf) {
    shelf.booksRead.some((id) => {
      if (id.toString() === bookId) {
        inReadList = true
        return false
      }
      return true
    })

    shelf.booksReading.some((id) => {
      if (id.toString() === bookId) {
        inReadingList = true
        return false
      }
      return true
    })

    shelf.booksToRead.some((id) => {
      if (id.toString() === bookId) {
        inToReadList = true
        return false
      }
      return true
    })
  }

  return res.json({
    book,
    ratings,
    inReadList,
    inReadingList,
    inToReadList,
    stars
  })
}
