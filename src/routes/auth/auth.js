var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../../config/db');
const crypto = require('crypto');

// get the login page 
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

// post info to login page 
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        };
        if (!user) {
            return res.redirect('/login')
        };
        req.logIn(user, function(err) {
            if (err) {
                return next(err)
            }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});

// get the register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// post info to the register page 
// TODO: [Ingrid] - link to type of user signing in
router.post('/register', (req, res, next) => {
    const salt = crypto.randomBytes(16);
    // salting/hashing to put into db
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return next(err);
        // inserting into db 
        db.run(
            `INSERT INTO users (email, password_hash, salt, phone_number) VALUES (?, ?, ?, ?)`,
            [req.body.email, hashedPassword.toString('hex'), salt.toString('hex'), req.body.phone],
            (err) => {
                if (err) {
                    console.log('Error in registering user!', err.message);
                    return next(err); 
                }
                res.redirect('/dashboard');
            }

        )
    })
    
})

// route to deserialize user and end session 
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;


