var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("./src/config/passport-config");
var session = require("express-session");
var app = express();
const { isBanned } = require("./src/middleware/checkUserStatus");

// routers
var indexRouter = require("./src/routes/index");
var authRouter = require("./src/routes/auth");
var userRouter = require("./src/routes/users");
var customerRouter = require("./src/routes/customers");
var adminRouter = require("./src/routes/admins");
var driverRouter = require("./src/routes/drivers");
var vendorRouter = require("./src/routes/vendors");
var profileRouter = require("./src/routes/profiles");

// view engine setup
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "src/public")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(isBanned); // middleware to make sure banned and suspended users are not allowed in

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/customers", customerRouter);
app.use("/admins", adminRouter);
app.use("/drivers", driverRouter);
app.use("/vendors", vendorRouter);
app.use("/", profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("shared/error");
});

module.exports = app;
