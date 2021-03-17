import { Schema, model } from 'mongoose';

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  comment: {
    type: String,
  },
  stars: {
    type: Number,
  },
});

const Rating = model('Rating', ratingSchema);

export default Rating;
