const userModel = require("../models/users");

async function loginAndRedirect(req, res, next, userId) {
  try {
    const user = await userModel.getUserByID(userId);
    if (!user)
      return next(new Error("Registration error, new user not found."));
    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect("/users");
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { loginAndRedirect };
