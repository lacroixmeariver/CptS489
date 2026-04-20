// middleware for verifying a vendor's status (therefore ability to sell food)
module.exports = {
  checkVendorStatus: (req, res, next) => {
    if (!req.user) return next();
    if (req.user.Verified === "Pending" || req.user.Verified === "Rejected") {
      return req.logout((err) => {
        if (err) return next(err);
      });
    }
    next();
  },
};
