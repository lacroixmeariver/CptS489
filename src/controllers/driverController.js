const driverModel = require("../models/drivers");

exports.getDashboard = async (req, res, next) => {
  try {
    const driver = await driverModel.getDriverByUserID(req.user.UserID);
    const activeDeliveries = await driverModel.getActiveOrders(driver.DriverID);
    const completedDeliveries = await driverModel.getCompletedOrders(
      driver.DriverID,
    );
    res.render("drivers/driver-dashboard", {
      user: req.user,
      activeDeliveries,
      completedDeliveries,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentOrder = (req, res) =>
  res.render("drivers/driver-current-order", { user: req.user });
exports.getEarnings = (req, res) =>
  res.render("drivers/driver-earnings", { user: req.user });
exports.getHistory = (req, res) =>
  res.render("drivers/driver-order-history", { user: req.user });
exports.getProfile = (req, res) =>
  res.render("shared/profile", { user: req.user });
