import { Schema, model } from 'mongoose';

const bookSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publicationDate: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  genres: {
    type: [String],
    required: true,
  },
});

const Book = model('Book', bookSchema);

export default Book;
