var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const db = require('../config/db');

// gets the vendor dashboard page
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('vendor/merchant-dashboard', { user: req.user });
});

// get the live operations page 
router.get('/live-operations', isAuthenticated, (req, res) => {
    res.render('live-operations', { user: req.user })
});

module.exports = router;