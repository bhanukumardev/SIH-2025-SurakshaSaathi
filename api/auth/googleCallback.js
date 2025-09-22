const passport = require('passport');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { saveUser, getUserByGoogleId, getUserByEmail } = require('../../lib/userStore');

function googleCallback(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/login' }, async (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }

    // If new user, assign role, but since backend, perhaps default or redirect to choose role
    // For simplicity, default to 'student'
    if (!user.role) {
      user.role = 'student';
      await saveUser(user);
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET);
    // Redirect to frontend with token or something
    res.redirect(`http://localhost:3000/login?token=${token}`);
  })(req, res, next);
}

module.exports = googleCallback;
