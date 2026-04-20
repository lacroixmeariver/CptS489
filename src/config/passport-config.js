var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
const userModel = require("../models/users");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, cb) => {
    userModel
      .findUserByEmail(email)
      .then((row) => {
        if (!row)
          return cb(null, false, { message: "Incorrect email or password." });
        const hashedPassword = Buffer.from(row.Password_hash, "hex");
        crypto.pbkdf2(
          password,
          row.Salt,
          310000,
          32,
          "sha256",
          (err, supplied) => {
            if (err) return cb(err);
            if (!crypto.timingSafeEqual(hashedPassword, supplied))
              return cb(null, false, {
                message: "Incorrect email or password.",
              });
            return cb(null, row);
          },
        );
      })
      .catch((err) => cb(err));
  }),
);

passport.serializeUser((user, cb) => {
  cb(null, user.UserID);
});

passport.deserializeUser((id, cb) => {
  userModel
    .getUserByID(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err));
});

module.exports = passport;
