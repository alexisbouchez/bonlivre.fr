import Book from '../../models/book-model';

export default async function getBooks(req, res) {
  const { search, page, genre, filter } = req.query;

  // Set regex query.
  const regexQuery = {
    $or: [
      { title: { $regex: search || '', $options: 'ig' } },
      { author: { $regex: search || '', $options: 'ig' } },
      { abstract: { $regex: search || '', $options: 'ig' } },
    ],
  };

  if (genre) regexQuery.genres = genre;

  // Set sort query.
  let sortQuery = '';

  if (filter === 'publicationDate') {
    sortQuery = '-publicationDate';
  }

  if (filter === 'score') {
    sortQuery = '-score';
  }

  // Count pages.
  const count = await Book.countDocuments(regexQuery);
  const numberOfPages = Math.ceil(count / 10);

  // Get books.
  const books = await Book.find(regexQuery)
    .sort(sortQuery)
    .skip(((page || 1) - 1) * 10)
    .limit(10);

  return res.json({ books, numberOfPages });
}
