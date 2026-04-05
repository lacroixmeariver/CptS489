var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const db = require('../config/db');

// get the admin dashboard page
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('admin/admin-dashboard', { user: req.user });
});


module.exports = router;