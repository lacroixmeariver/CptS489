var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../config/db');
const crypto = require('crypto');

// get the login page 
// if user already logged in it'll re-route to dashboard
router.get('/login', function(req, res, next) {
  if (req.user) {
    if (req.user.role === 'admin')  return res.redirect('/admin/dashboard');
    if (req.user.role === 'cook')   return res.redirect('/cook/dashboard');
    if (req.user.role === 'driver') return res.redirect('/driver/dashboard');
    if (req.user.role === 'vendor') return res.redirect('/vendor/dashboard');
    return res.redirect('/customer/dashboard');
  }
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
            if (user.role === 'admin')  return res.redirect('/admin/dashboard');
            if (user.role === 'cook')   return res.redirect('/cook/dashboard');
            if (user.role === 'driver') return res.redirect('/driver/dashboard');
            return res.redirect('/customer/dashboard');
        });
    })(req, res, next);
});

// get the register page
// if user already logged in it'll re-route to dashboard
router.get('/register', function(req, res, next) {
  if (req.user) {
    if (req.user.role === 'admin')  return res.redirect('/admin/dashboard');
    if (req.user.role === 'cook')   return res.redirect('/cook/dashboard');
    if (req.user.role === 'driver') return res.redirect('/driver/dashboard');
    if (req.user.role === 'vendor') return res.redirect('/vendor/dashboard');
    return res.redirect('/customer/dashboard');
  }
  res.render('register', { title: 'Register' });
});

// post info to the register page 
router.post('/register', (req, res, next) => {
    const { email, password, firstName, lastName, phoneNumber, role } = req.body;
    const validRoles = ['customer', 'vendor', 'driver'];
    const userRole = validRoles.includes(role) ? role : 'customer';
    const salt = crypto.randomBytes(16);
    // salting/hashing to put into db
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return next(err);
        // inserting into db 
        db.run(
            `INSERT INTO Users (email, password_hash, salt, first_name, last_name, role,  status, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, 0)`, // by default user is valid
            [email, hashedPassword.toString('hex'), salt.toString('hex'), firstName, lastName, role, 0, req.body.phone],
            (err) => {
                if (err) {
                    console.log('Error in registering user!', err.message);
                    return next(err); 
                }
                res.redirect('/user');
            }

        )
    })
    
})

// get forgot password page
router.get('/forgot-password', (req, res, next) =>{
    res.render('forgot-password', { title: 'Forgot Password' });
});

// route to deserialize user and end session 
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;


