import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user-model';
import mailer from '../../utils/mailer';

export default async function update(req, res) {
  const { user } = req;
  const { email, password, username } = req.body;

  if (email) {
    if (!validator.isEmail(email))
      return res.status(400).json({ error: 'Invalid email.' });

    const userFoundByEmail = await User.findOne({ email });
    if (email !== user.email) {
      if (userFoundByEmail) {
        return res.status(400).json({ error: 'Email already used. ' });
      }
      user.newEmail = email;

      const { DOMAIN_NAME } = process.env;

      const { id } = user;
      const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a';
      const token = jwt.sign({ id }, JWT_SECRET);

      mailer(
        email,
        'Confirmez votre adresse email',
        `<p>Afin de confirmer votre nouvelle adresse email, <a href="${DOMAIN_NAME}/auth/confirm/${token}">cliquez ici</a>.</p>`
      );
    }
  }

  if (username) {
    if (username.length < 6)
      return res
        .status(400)
        .json({ error: 'Username too short (minimum 6 characters).' });

    if (username.length > 50)
      return res
        .status(400)
        .json({ error: 'Username too long (maximum 50 characters).' });

    const userFoundByUsername = await User.findOne({ username });
    if (userFoundByUsername && username !== user.username)
      return res.status(400).json({ error: 'Username already used. ' });

    user.username = username;
  }

  if (password) {
    if (password.length < 8)
      return res
        .status(400)
        .json({ error: 'Password too short (minimum 8 characters).' });

    if (password.length > 255)
      return res
        .status(400)
        .json({ error: 'Password too long (maximum 255 characters).' });

    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
  }

  try {
    await user.save();
  } catch (err) {
    return res.status(400).json({ error: 'Internal error. ' });
  }

  return res.json({ message: 'Account updated.' });
}
