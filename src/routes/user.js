var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');

// gets the user page
// routes according to user type
router.get('/', isAuthenticated, (req, res, next) => {
  
  console.log("User role: " + req.user.role);
  let role = req.user.role;
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

// get the browse page
router.get('/browse', isAuthenticated, (req, res, next) => {
  res.render('browse', { user: req.user });
})

module.exports = router;
