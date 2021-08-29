import { Router } from 'express'

import authenticate from '../middleware/authenticate'
import { addBookToShelf, getShelf } from '../controllers/books/shelf'
import getBooks from '../controllers/books/books'
import { getBook, addBook } from '../controllers/books/book'
import rate from '../controllers/books/rate'
import {
  addComment,
  updateComment,
  deleteComment
} from '../controllers/books/comment'

const bookRouter = Router()

// Shelf
bookRouter.get('/shelf/', authenticate, getShelf)
bookRouter.post('/shelf/:shelf/:bookId', authenticate, addBookToShelf)

// Book
bookRouter.get('/:bookId', getBook)
bookRouter.get('/', getBooks)
bookRouter.post('/', addBook)

// Star rating and comments
bookRouter.post('/rate/:bookId', authenticate, rate)
bookRouter.post('/comment/:bookId', authenticate, addComment)
bookRouter.put('/comment/:ratingId', authenticate, updateComment)
bookRouter.delete('/comment/:ratingId', authenticate, deleteComment)

export default bookRouter
