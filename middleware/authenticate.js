import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user-model';

dotenv.config();

export default async function authenticate(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a';

  let user;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const userId = jwt.verify(token, JWT_SECRET).id;
    user = await User.findById(userId);
  } catch (err) {
    return res.status(400).json({ error: 'Unauthorized.' });
  }

  if (!user) return res.status(400).json({ error: 'Unauthorized.' });

  req.user = user;

  return next();
}
