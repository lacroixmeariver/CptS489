var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');

// gets the user page
// routes according to user type
router.get('/user', isAuthenticated, (req, res, next) => {

  let role = req.user.Role;
  if (role === 'admin')
  {
    res.redirect('/admin/dashboard');
  }
  else if (role === 'vendor')
  {
    res.redirect('/vendor/dashboard');
  }
  else if (role === 'driver')
  {
    res.redirect('/driver/dashboard');
  }
  else // defaults to customer dash
  {
    res.redirect('/customer/dashboard');
  }
  
});

router.get('/user-profile', isAuthenticated, (req, res, next) => {

  let role = req.user.Role;
  if (role === 'admin')
  {
    res.redirect('/admin/profile');
  }
  else if (role === 'vendor')
  {
    res.redirect('/vendor/profile');
  }
  else if (role === 'driver')
  {
    res.redirect('/driver/profile');
  }
  else 
  {
    res.redirect('/customer/profile');
  }
  
});

// get the browse page
router.get('/browse', isAuthenticated, (req, res, next) => {
  res.render('browse', { user: req.user });
})

module.exports = router;
