var express = require('express');
var passport = require('passport');
var router = express.Router();
const { loginAndRedirect } = require('../service/loginAndRedirect')
const { createUser } = require('../service/createUser');
const { dashRedirect } = require('../middleware/redirectByRole');

// get the login page
// if user already logged in it'll re-route to dashboard
router.get('/login', function(req, res, next) {
  if (req.user) {
    dashRedirect(res, req.user.Role); 
    return;
  }
  res.render('auth/login', { title: 'Login', reason: req.query.reason });
});

// post info to login page
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.redirect('/login');
    req.logIn(user, function(err) {
      if (err) return next(err);
      dashRedirect(res, user.Role);
    });
  })(req, res, next);
});

// get the register page
// if user already logged in it'll re-route to dashboard
router.get('/register', function(req, res, next) {
  if (req.user) {
    dashRedirect(res, req.user.Role);
    return;
  }
  res.render('auth/register', { title: 'Register' });
});


// post info to the register page
router.post('/register', async (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;
  try {
    const userID = await createUser({ email, password, firstName, lastName, phoneNumber, role }); // returns last ID
    await loginAndRedirect(req, res, next, userID);
  } catch (err) {
    next(err);
  }
});

// get forgot password page
router.get('/forgot-password', (req, res, next) => {
  res.render('auth/forgot-password', { title: 'Forgot Password' });
});

// route to deserialize user and end session
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});



module.exports = router;