var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const db = require('./db')


passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, cb) {
    db.get('SELECT * FROM users WHERE email = ?', [ email ], function(err, row) {
    if (err) {return cb(err); }
    if (!row) {return cb(null, false, {message: 'Incorrect email or password.'}); }

    const hashedPassword = Buffer.from(row.password_hash, 'hex');
    const salt = Buffer.from(row.salt, 'hex');  

    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, supplied) {
        if (err) { return cb(err); }
        console.log('stored hash:', row.password_hash);
        if (!crypto.timingSafeEqual(hashedPassword, supplied)) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }
      return cb(null, row);
    });
  });
}));

passport.serializeUser((user, cb) => cb(null, user.userId));

passport.deserializeUser(function(id, cb) {
    db.get('SELECT * FROM users WHERE userId = ?', [id], (err, user) => cb(err, user));
  
});

module.exports = passport;