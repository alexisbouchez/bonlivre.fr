import { Schema, model } from 'mongoose';

const shelfSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  booksRead: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  booksReading: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  booksToRead: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
});

const Shelf = model('Shelf', shelfSchema);

export default Shelf;
