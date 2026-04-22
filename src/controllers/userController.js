const userModel = require("../models/users");

exports.getUserPage = async (req, res, next) => {
  try {
    console.log("User: ", req.user);
    const role = req.user.Role.toLowerCase();
    if (role === "admin") {
      res.redirect("/admins/dashboard");
    } else if (role === "vendor") {
      res.redirect("/vendors/dashboard");
    } else if (role === "driver") {
      res.redirect("/drivers/dashboard");
    } else // defaults to customer dash
    {
      res.redirect("/customers/dashboard");
    }
  } catch (err) {
    next(err);
  }
};
