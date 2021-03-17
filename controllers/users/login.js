import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../../models/user-model';

dotenv.config();

export default async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'A field is missing.' });
  }

  const userFoundByEmail = await User.findOne({ email });
  if (!userFoundByEmail)
    return res.status(400).json({ error: 'Invalid credentials.' });

  if (!userFoundByEmail.isConfirmed)
    return res
      .status(400)
      .json({ error: 'Account not confirmed yet. Check your emails.' });

  const doesPasswordMatch = await bcrypt.compare(
    password,
    userFoundByEmail.password
  );
  if (!doesPasswordMatch)
    return res.status(400).json({ error: 'Invalid credentials.' });

  const { id } = userFoundByEmail;
  const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a';
  const token = jwt.sign({ id }, JWT_SECRET);

  return res.json({ token });
}
