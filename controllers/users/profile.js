export default function getProfile(req, res) {
  return res.json({
    email: req.user.email,
    newEmail: req.user.newEmail,
    username: req.user.username,
  });
}
