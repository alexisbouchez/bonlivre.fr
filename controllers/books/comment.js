import Rating from '../../models/rating-model';

export async function addComment(req, res) {
  const { user } = req;
  const { bookId } = req.params;
  const { comment } = req.body;

  // Verify comment.
  if (comment) {
    if (comment.length.length < 10) {
      return res.status(400).json({ error: 'Invalid comment.' });
    }

    if (comment.length.length > 1000) {
      return res.status(400).json({ error: 'Invalid comment.' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid comment.' });
  }

  // Get rating.
  let rating;

  try {
    rating = await Rating.findOne({ user: user.id });
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' });
  }

  // Set comment.
  if (rating) {
    if (rating.comment) {
      return res.status(400).json({ error: 'Already commented.' });
    }

    rating.comment = comment;
  }

  if (!rating) {
    rating = await Rating.create({
      user: user.id,
      book: bookId,
      comment,
    });
  }

  await rating.save();

  return res.json({ message: 'Comment added.' });
}

export async function updateComment(req, res) {
  const { user } = req;
  const { ratingId } = req.params;
  const { comment } = req.body;

  // Verify comment.
  if (comment) {
    if (comment.length.length < 10) {
      return res.status(400).json({ error: 'Invalid comment.' });
    }

    if (comment.length.length > 1000) {
      return res.status(400).json({ error: 'Invalid comment.' });
    }
  } else {
    return res.status(400).json({ error: 'Invalid comment.' });
  }

  // Get rating.
  let rating;

  try {
    rating = await Rating.findById(ratingId);
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' });
  }

  if (rating.user.toString() !== user.id) {
    return res.status(400).json({ error: 'Unauthorized.' });
  }

  if (!rating) {
    return res.status(400).json({ error: 'Rating not found.' });
  }

  // Update comment.
  rating.comment = comment;
  await rating.save();

  return res.json({ message: 'Comment updated.' });
}

export async function deleteComment(req, res) {
  const { ratingId } = req.params;
  const { user } = req;

  // Get rating.
  let rating;
  try {
    rating = await Rating.findById(ratingId);
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' });
  }

  if (rating.user.toString() !== user.id) {
    return res.status(400).json({ error: 'Unauthorized.' });
  }

  if (!rating) {
    return res.status(400).json({ error: 'Rating not found.' });
  }

  // Delete comment.
  rating.comment = '';
  await rating.save();

  return res.json({ message: 'Comment deleted.' });
}
