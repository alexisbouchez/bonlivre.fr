import { Schema, model } from 'mongoose';

const fields = {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  newEmail: String,
  password: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  alreadyReadList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  currentlyReadingList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  readingList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
};

const options = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const userSchema = Schema(fields, options);

const User = model('User', userSchema);

export default User;
