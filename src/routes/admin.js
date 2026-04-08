var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const db = require('../config/db');

// get the admin dashboard page
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('admin/admin-dashboard', { user: req.user });
});

router.get('/manage-users', isAuthenticated, (req, res) => {
    res.render('admin/manage-user', { user: req.user })
});

router.get('/issues', isAuthenticated, (req, res) => {
    res.render('admin/disputes', { user: req.user })
});

router.get('/revenue', isAuthenticated, (req, res) => {
    res.render('admin/revenue', { user: req.user })
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user })
});
module.exports = router;