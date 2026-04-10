var express = require('express');
var passport = require('passport');
var router = express.Router();
const multer  = require('multer')
const path = require('path');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    cb(null, req.body.email + '-vendor' + ext); // formatting file name 
  }
});
const upload = multer({ storage });
const userModel = require('../models/user');
const createUser = require('../middleware/createUser');
const redirectByRole = require('../middleware/redirectByRole');

// get the login page 
// if user already logged in it'll re-route to dashboard
router.get('/login', function(req, res, next) {
  if (req.user) {
    redirectByRole.dashRedirect(res, user.role);
    return res.redirect('/customer/dashboard');
  }
  res.render('auth/login', { title: 'Login'});
});


// post info to login page 
router.post('/login', function(req, res, next) {
   
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err)
        };
        if (!user) {
            return res.redirect('/login')
        };
        req.logIn(user, function(err) {
            if (err) {
                return next(err)
            }
            redirectByRole.dashRedirect(res, user.role); 
        });
    })(req, res, next);
});

// get the register page
// if user already logged in it'll re-route to dashboard
router.get('/register', function(req, res, next) {
  if (req.user) {
    redirectByRole.dashRedirect(res, user.role);
  }
  res.render('auth/register', { title: 'Register' });
});

function loginAndRedirect(req, res, next, userId) {
    userModel.getUserByID(userId, (err, user) => {
        console.log('getUserByID result:', err, user);
        if (err) return next(err);
        if (!user) return next(null, false, { message: 'Incorrect email or password.' });
        req.login(user, (err) => {
            if (err) return next(err);
            res.redirect('/user');
        })
    });

}

// post info to the register page 
router.post('/register', upload.array('documents', 5), (req, res, next) => {
    const { email, password, firstName, lastName, phoneNumber, role } = req.body;
   createUser.createUser({ email, password, firstName, lastName, phoneNumber, role }, (err, userID) => {
        if (err) return next(err);
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


