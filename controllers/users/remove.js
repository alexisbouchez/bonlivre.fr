import Shelf from '../../models/shelf-model';

export default async function remove(req, res) {
  try {
    await req.user.remove();
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' });
  }

  try {
    const shelf = await Shelf.findOne({
      user: req.user.id,
    });

    await shelf.remove();
  } catch (err) {
    return res.status(400).json({ error: 'Internal error.' });
  }

  return res.json({ message: 'Account removed.' });
}
