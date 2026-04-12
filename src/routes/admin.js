var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const userModel = require('../models/user');
const adminModel = require('../models/admin');

// get the admin dashboard page
router.get('/dashboard', isAuthenticated, (req, res, next) => {
    res.render('admin/admin-dashboard', { user: req.user });
});

// get the manage user page with all user info to display
router.get('/manage-users', isAuthenticated, async (req, res, next) => {
    try {
        const users = await userModel.getAllUserInfo();
        res.render('admin/manage-user', { user: req.user, users, reason: req.query.reason }); // req.query.reason is for error message query in url
    } catch (err) {
        next(err);
    }
});

// get the issues/disputes page
router.get('/issues', isAuthenticated, async (req, res, next) => {
    try {
        const disputes = await adminModel.getAllDisputes();
        res.render('admin/disputes', { user: req.user, disputes });
    } catch (err) {
        next(err);
    }
});

// get the vendor applications page
router.get('/vendor-applications', isAuthenticated, async (req, res, next) => {
    try {
        res.render('admin/vendor-applications', { user: req.user });
    } catch (err) {
        next(err);
    }
});

// get the revenue page
// TODO: make revenue page
router.get('/revenue', isAuthenticated, (req, res) => {
    res.render('admin/revenue', { user: req.user });
});

// get the profile page
router.get('/profile', isAuthenticated, (req, res) => {
    res.render('shared/profile', { user: req.user });
});

// ban user post route
router.post('/ban-user/:userID', isAuthenticated, async (req, res, next) => {
    // if statement to catch self-ban
    if (parseInt(req.params.userID) === req.user.UserID){
        return res.redirect('/admin/manage-users?reason=self-ban');
    }
    try {
        await adminModel.banUser(req.params.userID);
        res.redirect('/admin/manage-users');
    } catch (err) {
        next(err);
    }
});

// suspend user post route
router.post('/suspend-user/:userID', isAuthenticated, async (req, res, next) => {
    // if statement to catch self-suspend
     if (parseInt(req.params.userID) === req.user.UserID){
        return res.redirect('/admin/manage-users?reason=self-suspend');
    }
    try {
        await adminModel.suspendUser(req.params.userID);
        res.redirect('/admin/manage-users');
    } catch (err) {
        next(err);
    }
});

// reinstate user post route
router.post('/reinstate-user/:userID', isAuthenticated, async (req, res, next) => {
    try {
        await adminModel.reinstateUser(req.params.userID);
        res.redirect('/admin/manage-users');
    } catch (err) {
        next(err);
    }
});

// still in construction ---
router.post('/resolve-dispute/:disputeID', isAuthenticated, async (req, res, next) => {
    try {
        await adminModel.updateDisputeStatus(req.params.disputeID);
        console.log("Resolved dispute: ", req.params.disputeID);
        res.redirect('/admin/issues');
    } catch (err) {
        next(err);
    }
});

router.post('/appeal-dispute/:disputeID', isAuthenticated, async (req, res, next) => {
    try {
        await adminModel.updateDisputeStatus(req.params.disputeID);
        console.log("Appealed dispute: ", req.params.disputeID);
        res.redirect('/admin/issues');
    } catch (err) {
        next(err);
    }
});

module.exports = router;