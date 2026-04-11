var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const db = require('./db')
const userModel = require('../models/user')


passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, cb) { // usernameField lets passport know we're not using username to log in/reg
  userModel.findUserByEmail(email, function(err, row) {
    if (err) return cb(err);
    if (!row) return cb(null, false, {message: 'Incorrect email or password.'}); 
    const hashedPassword = Buffer.from(row.Password_hash, 'hex');
    crypto.pbkdf2(password, row.Salt, 310000, 32, 'sha256', function(err, supplied) {
      if (err) return cb(err); 
      if (!crypto.timingSafeEqual(hashedPassword, supplied)) return cb(null, false, { message: 'Incorrect email or password.' });
      return cb(null, row);
    });
  });
}));

passport.serializeUser((user, cb) => {
  //console.log('serializing user:', user); // debug print
  cb(null, user.UserID);
});

passport.deserializeUser(function(id, cb) {
  userModel.getUserByID(id, (err, user) => {
    //console.log('deserializing user:', user); // debug print  
    cb(err, user);
  });
});

module.exports = passport;