import Book from '../../models/book-model'
import Rating from '../../models/rating-model'

export default async function rate(req, res) {
  const { user } = req
  const { bookId } = req.params
  const { stars } = req.body

  // Verify stars field.
  if (typeof stars !== 'number') {
    return res.status(400).json({ error: 'Invalid rating.' })
  }

  if (stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Invalid rating.' })
  }

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

  // Get rating or set it.
  let ratingToUpdate

  try {
    ratingToUpdate = await Rating.findOne({
      user: user.id,
      book: book.id
    })
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' })
  }

  if (!ratingToUpdate) {
    ratingToUpdate = await Rating.create({
      user: user.id,
      book: bookId
    })
  }

  ratingToUpdate.stars = stars
  await ratingToUpdate.save()

  // Calculate the score.
  const ratings = await Rating.find({
    book: bookId
  })

  let countOfStars = 0
  let sumOfStars = 0

  ratings.forEach((rating) => {
    if (rating.stars) {
      sumOfStars += rating.stars
      countOfStars += 1
    }
  })

  book.score = sumOfStars / (countOfStars === 0 ? 1 : countOfStars)
  await book.save()

  return res.json({ score: book.score })
}
