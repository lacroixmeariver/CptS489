const { getDriverByUserID } = require("../models/drivers");

driverModel = require("../models/drivers");

module.exports = {
  isDriverOnline: (req, res, next) => {
    if (req.user.Role === "driver") {
      const driverStatus = driverModel.getDriverStatus(req.user.UserID);
      if (driverStatus === "Online") {
        return next();
      }
    }
    res.redirect("/login"); // TODO add error screen/modal?
  },
};
