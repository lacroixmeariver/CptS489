// middleware that runs every request to verify a user is not banned
module.exports = {
  isBanned: (req, res, next) => {
    if (!req.user) return next(); // no user logged in yet

    if (req.user.Status === "1") {
      return req.logout((err) => {
        if (err) return next(err);
        res.redirect("/login?reason=banned");
      });
    }

    next();
  },
};
