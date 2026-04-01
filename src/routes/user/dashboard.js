var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../../middleware/isAuth');

router.get('/dashboard', isAuthenticated, (req, res, next) => {
  console.log(req.user);
  res.render('customer-dashboard', { title: 'Dashboard' });
  
});

module.exports = router;
