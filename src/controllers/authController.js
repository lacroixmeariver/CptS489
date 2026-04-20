const { loginAndRedirect } = require("../service/loginAndRedirect");
const { createUser } = require("../service/createUser");
const { dashRedirect } = require("../middleware/redirectByRole");
const passport = require("passport");

// GET operations ----------------------------------------------------------

exports.getLogin = (req, res) => {
  if (req.user) {
    return loginAndRedirect(res, req.user.UserID);}
  res.render("auth/login", { title: "Login", reason: req.query.reason });
};

exports.getRegister = (req, res) => {
  if (req.user) return dashRedirect(res, req.user.Role);
  res.render("auth/register", { title: "Register" });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};

// POST operations ----------------------------------------------------------

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login?reason=invalid");
    req.logIn(user, (err) => {
      if (err) return next(err);
      dashRedirect(res, user.Role);
    });
  })(req, res, next);
};

exports.postRegister = async (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber, role } = req.body;
  const roleLower = role.toLowerCase();

  // building additional info that'll help with registering different kinds of users
  const additionalInfo =
    roleLower === "vendor"
      ? {
          merchantName: req.body.merchantName,
          merchantAddress: req.body.merchantAddress,
        }
      : roleLower === "driver"
        ? {
            licensePlateNumber: req.body.licensePlateNumber,
            driversLicenseNumber: req.body.driversLicenseNumber,
            vehicleMake: req.body.vehicleMake,
            vehicleModel: req.body.vehicleModel,
            vehicleColor: req.body.vehicleColor,
          }
        : {};

  try {
    const userID = await createUser(
      { email, password, firstName, lastName, phoneNumber, role },
      additionalInfo,
    );
    await loginAndRedirect(req, res, next, userID);
  } catch (err) {
    next(err);
  }
};
