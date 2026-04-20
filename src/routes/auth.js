var express = require('express');
var passport = require('passport');
var router = express.Router();
const userModel = require('../models/user');
const createUser = require('../middleware/createUser');
const redirectByRole = require('../middleware/redirectByRole');
const MerchantRepository = require("../middleware/merchantRepository");
const Merchant = require("../backend/models/merchant")
const { dbPromise, db } = require('../config/db');
const Customer = require('../backend/models/customer');
const CustomerRepository = require('../middleware/customerRepository');

// get the login page 
// if user already logged in it'll re-route to dashboard
router.get('/login', function(req, res, next) {
  if (req.user) {
    redirectByRole.dashRedirect(res, user.Role);
    return res.redirect('/customer/dashboard');
  }
  res.render('auth/login', { title: 'Login'});
});


// post info to login page 
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.redirect('/login');
    console.log('user.Role:', user.Role);
    req.logIn(user, function(err) {
      if (err) return next(err);
      redirectByRole.dashRedirect(res, user.Role); 
    });
    })(req, res, next);
});

// get the register page
// if user already logged in it'll re-route to dashboard
router.get('/register', function(req, res, next) {
  if (req.user) {
    redirectByRole.dashRedirect(res, user.Role);
  }
  res.render('auth/register', { title: 'Register' });
});

function loginAndRedirect(req, res, next, userId) {
  userModel.getUserByID(userId, (err, user) => {
    if (err) return next(err);
    if (!user) return next(null, false, { message: 'Incorrect email or password.' });
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/user');
    })
  });
}

// post info to the register page 
router.post('/register', (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body
  createUser.createUser({ email, password, firstName, lastName, phoneNumber, role }, async (err, userID) => {
    if (err) return next(err);
    if (role === 'vendor')
    {
      const repo = new MerchantRepository(dbPromise);

      const defaultName = `${firstName}'s Store`;

      const merchant = new Merchant(
        0,
        defaultName,
        null,
        true,
        0,
        [],
        'closed'
      );

      await repo.save(merchant, userID);
    }
      else if (role === 'customer')
      {
        const repo = new CustomerRepository(dbPromise);
        const customer = new Customer(
          0,
          null
         );

        await repo.save(customer, userID);
      }
    loginAndRedirect(req, res, next, userID)
  })
})


// get forgot password page
router.get('/forgot-password', (req, res, next) =>{
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


