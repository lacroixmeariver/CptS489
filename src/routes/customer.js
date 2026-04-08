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
    db.all(`
        SELECT o.*, m.MerchantName 
        FROM Orders o
        JOIN Customers c ON o.CustomerID = c.CustomerID
        JOIN Merchants m ON o.MerchantID = m.MerchantID
        WHERE c.UserID = ? AND o.OrderStatus NOT IN ('Completed', 'Cancelled')
        ORDER BY o.TimeOrdered DESC
    `, [req.user.userID], (err, orders) => {
        res.render('partials/order-status', { orders: orders || [] });
    });
});

// get the partial order history page element
router.get('/order-history', isAuthenticated, (req, res) => {
    db.all(`
        SELECT o.*, m.MerchantName 
        FROM Orders o
        JOIN Customers c ON o.CustomerID = c.CustomerID
        JOIN Merchants m ON o.MerchantID = m.MerchantID
        WHERE c.UserID = ?
        ORDER BY o.TimeOrdered DESC
    `, [req.user.userID], (err, orders) => {
        res.render('partials/order-history', { orders: orders || [] });
    });
});

// get the partial reviews page element
router.get('/reviews', isAuthenticated, (req, res) => {
    db.all(`
        SELECT r.*, m.MerchantName
        FROM Reviews r
        JOIN Customers c ON r.CustomerID = c.CustomerID
        JOIN Merchants m ON r.MerchantID = m.MerchantID
        WHERE c.UserID = ?
        ORDER BY r.ReviewDate DESC
    `, [req.user.userID], (err, reviews) => {
        res.render('partials/customer-reviews', { reviews: reviews || [] });
    });
});


router.get('/order-history', isAuthenticated, (req, res) => {
    res.render('order-history', { user: req.user })
});

router.get('/order-history', isAuthenticated, (req, res) => {
    res.render('order-history', { user: req.user })
});


router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user })
});


router.get('/cart', isAuthenticated, (req, res) => {
    res.render('customer/cart', { user: req.user })
});

router.get('/checkout', isAuthenticated, (req, res) => {
    res.render('customer/checkout', { user: req.user })
});
/*
    TODO: CUSTOMER ROUTES
    - BROWSE
    - MY ORDERS 
        - ORDER HISTORY PAGE NEEDS STANDALONE
    - MY ACCOUNT
    - CURRENT ORDER 
    - ORDER HISTORY
    - REVIEWS


*/

module.exports = router;