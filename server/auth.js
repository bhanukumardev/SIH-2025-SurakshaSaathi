require('dotenv').config();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const { findUserByEmail, findUserById, findUserByGoogleId, addUser } = require('./db');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

// Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = findUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!user.password) {
        return done(null, false, { message: 'No password set for this account.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = findUserByGoogleId(profile.id);
    if (user) {
      return done(null, user);
    }
    // Check if user exists by email
    user = findUserByEmail(profile.emails[0].value);
    if (user) {
      // Link Google ID
      user.googleId = profile.id;
      // Update in DB (assuming addUser can handle updates, but for simplicity, skip for now)
      return done(null, user);
    }
    // Create new user
    const newUser = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      role: 'student', // Default role
      googleId: profile.id,
    };
    addUser(newUser);
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
