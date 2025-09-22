const passport = require('passport');

function googleAuth(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

module.exports = googleAuth;
