import jwt from 'jsonwebtoken';

import User from '../../models/user-model';
import mailer from '../../utils/mailer';

export default async function sendReinitializationEmail(req, res) {
  const { email } = req.body;

  const userFoundByEmail = await User.findOne({ email });
  if (!userFoundByEmail) {
    return res.status(400).json({ error: 'User not found.' });
  }

  const { id } = userFoundByEmail;
  const JWT_SECRET = process.env.JWT_SECRET || 'nB4,Cx$*~a';
  const token = jwt.sign({ id }, JWT_SECRET);

  mailer(
    email,
    'Réinitialisation du mot de passe',
    `<p>Pour réinitialiser votre mot de passe, <a href="http://localhost:3000/auth/reinitialize-password/${token}">cliquez ici</a>.</p>`
  );

  return res.json({ message: 'Email sent.' });
}
