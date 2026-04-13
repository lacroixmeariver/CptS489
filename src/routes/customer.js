var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const db = require('../config/db');

// get the customer dashboard page
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('customer/customer-dashboard', { user: req.user });
});


// get the partial order status page element
router.get('/order-status', isAuthenticated, (req, res) => {
});

// get the partial order history page element
router.get('/order-history', isAuthenticated, (req, res) => {
});

// get the partial reviews page element
router.get('/reviews', isAuthenticated, (req, res) => {
});


router.get('/order-history', isAuthenticated, (req, res) => {
    res.render('customer/customer-order-history', { user: req.user })
});

router.get('/order-history', isAuthenticated, (req, res) => {
    res.render('customer/customer-order-history', { user: req.user })
});


router.get('/profile', isAuthenticated, (req, res) => {
    res.render('shared/profile', { user: req.user })
});


router.get('/cart', isAuthenticated, (req, res) => {
    res.render('customer/cart', { user: req.user })
});

router.get('/checkout', isAuthenticated, (req, res) => {
    res.render('customer/checkout', { user: req.user })
});


module.exports = router;