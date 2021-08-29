import Book from '../../models/book-model'
import Shelf from '../../models/shelf-model'

export async function getShelf(req, res) {
  const { user } = req

  let shelf

  try {
    shelf = await Shelf.findOne({ user: user.id })
      .populate('booksRead')
      .populate('booksReading')
      .populate('booksToRead')
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' })
  }

  return res.json({
    booksRead: shelf.booksRead,
    booksReading: shelf.booksReading,
    booksToRead: shelf.booksToRead
  })
}

export async function addBookToShelf(req, res) {
  const { shelf, bookId } = req.params
  const { user } = req

  // Verify the shelf.
  if (!['booksRead', 'booksReading', 'booksToRead'].includes(shelf)) {
    return res.status(400).json({ error: 'Wrong shelf.' })
  }

  // Get shelf.
  let userShelf

  try {
    userShelf = await Shelf.findOne({
      user: user.id
    })
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' })
  }

  if (!userShelf) {
    return res.status(400).json({ error: 'Shelf not found.' })
  }

  // Verify the book.
  let book
  try {
    book = await Book.findById(bookId)
  } catch (err) {
    return res.status(400).json({ error: 'Book not found.' })
  }

  if (!book) {
    return res.status(400).json({ error: 'Book not found.' })
  }

  // Update shelf.
  const booksReadIndex = userShelf.booksRead.indexOf(bookId)
  if (shelf !== 'booksRead' && booksReadIndex !== -1) {
    userShelf.booksRead = userShelf.booksRead
      .slice(0, booksReadIndex)
      .concat(userShelf.booksRead.slice(booksReadIndex + 1))
  }

  const booksReadingIndex = userShelf.booksReading.indexOf(bookId)
  if (shelf !== 'booksReading' && booksReadingIndex !== -1) {
    userShelf.booksReading = userShelf.booksReading
      .slice(0, booksReadingIndex)
      .concat(userShelf.booksReading.slice(booksReadingIndex + 1))
  }

  const booksToReadIndex = userShelf.booksToRead.indexOf(bookId)
  if (shelf !== 'booksToRead' && booksToReadIndex !== -1) {
    userShelf.booksToRead = userShelf.booksToRead
      .slice(0, booksToReadIndex)
      .concat(userShelf.booksToRead.slice(booksToReadIndex + 1))
  }

  userShelf[shelf].push(bookId)
  await userShelf.save()

  return res.json({ message: 'Book added to shelf.' })
}
