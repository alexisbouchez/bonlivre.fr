import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import User from '../../models/user-model'

dotenv.config()

export default async function confirm(req, res) {
  const { token } = req.params

  const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a'
  let email
  try {
    email = jwt.verify(token, JWT_SECRET).email
  } catch (err) {
    return res.status(400).json({ error: 'Unauthorized.' })
  }

  let user
  try {
    user = await User.findOne({ email })
  } catch (err) {
    return res.status(400).json({ error: 'Unauthorized.' })
  }

  if (!user) {
    return res.status(400).json({ error: 'Unauthorized.' })
  }

  if (user.isConfirmed && user.newEmail) {
    user.email = user.newEmail
    user.newEmail = ''
  }

  user.isConfirmed = true
  await user.save()

  return res.json({ message: 'Account confirmed. ' })
}
