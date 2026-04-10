var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var userModel = require('../models/user')
// const db = require('./db')


passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, cb) { // usernameField lets passport know we're not using username to log in/reg
  console.log("EMAIL: ", email);
  userModel.findUserByEmail(email, (err, user) => {
    if (err) return cb(err);

    if (!user) {
      return cb(null, false, { message: 'Incorrect email or password.' });
    }
    const hashedPassword = Buffer.from(user.Password_hash, 'hex');
    crypto.pbkdf2(password, user.Salt, 310000, 32, 'sha256', function(err, supplied) {
      if (err) {
        return cb(err); 
      }
      if (hashedPassword.length !== supplied.length || !crypto.timingSafeEqual(hashedPassword, supplied)) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }
      return cb(null, user);
    });
  });
}))

passport.serializeUser((user, cb) => {
  // console.log('serializing user:', user); // debug print
  cb(null, user.UserID);
});

passport.deserializeUser((id, done) => {
    userModel.getUserByID(id, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        done(null, user);
    });
});


module.exports = passport;