import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../../models/user-model';
import Shelf from '../../models/shelf-model';

import mailer from '../../utils/mailer';

dotenv.config();

export default async function signup(req, res) {
  const { email, username, password } = req.body;

  // Verify the fields.
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'A field is missing.' });
  }

  if (!validator.isEmail(email))
    return res.status(400).json({ error: 'Invalid email.' });

  const userFoundByEmail = await User.findOne({ email });
  if (userFoundByEmail)
    return res.status(400).json({ error: 'Email already used.' });

  const userFoundByUsername = await User.findOne({ username });
  if (userFoundByUsername)
    return res.status(400).json({ error: 'Username already used.' });

  if (username.length < 6)
    return res
      .status(400)
      .json({ error: 'Username too short (minimum 6 characters).' });

  if (username.length > 50)
    return res
      .status(400)
      .json({ error: 'Username too short (maximum 50 characters).' });

  if (password.length < 8)
    return res
      .status(400)
      .json({ error: 'Password too short (minimum 8 characters).' });

  if (password.length > 255)
    return res
      .status(400)
      .json({ error: 'Password too long (maximum 255 characters).' });

  const encryptedPassword = await bcrypt.hash(password, 10);

  // Create the user.
  let user;
  try {
    user = await User.create({ email, username, password: encryptedPassword });
  } catch (err) {
    return res.status(400).json({ error: 'Internal error. ' });
  }

  // Create the token.
  const { id } = user;
  const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a';
  const token = jwt.sign({ email }, JWT_SECRET);

  const DOMAIN_NAME = process.env.DOMAIN_NAME || 'domain-name.com';

  // Send the confirmation email.
  mailer(
    email,
    'Confirmez votre compte',
    `<p>
      Afin de confirmer votre compte, <a href="${DOMAIN_NAME}/auth/confirm/${token}">cliquez ici</a>.
    </p>`
  );

  // Create shelf.
  await Shelf.create({
    user: id,
  });

  return res.json({ message: 'Successfully signed up.' });
}
