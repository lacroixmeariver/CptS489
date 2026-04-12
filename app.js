var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./src/config/passport-config');
var session = require('express-session');
var app = express();
const { checkUserStatus } = require('./src/middleware/checkUserStatus');


// routers
var indexRouter = require('./src/routes/index');
var authRouter = require('./src/routes/auth');
var userRouter = require('./src/routes/user');
var customerRouter = require('./src/routes/customer');
var adminRouter = require('./src/routes/admin');
var driverRouter = require('./src/routes/driver');
var vendorRouter = require('./src/routes/vendor');

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(checkUserStatus); // middleware to make sure banned and suspended users are not allowed in

app.use('/', indexRouter);
app.use('/', authRouter)
app.use('/', userRouter);
app.use('/customer', customerRouter);
app.use('/admin', adminRouter);
app.use('/driver', driverRouter);
app.use('/vendor', vendorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
