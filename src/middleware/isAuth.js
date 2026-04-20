module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },

  // making sure admin verified if viewing admin page
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.Role === "admin") {
      return next();
    }
    res.redirect("/login");
  },
};
