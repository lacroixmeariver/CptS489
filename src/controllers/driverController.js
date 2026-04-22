const driverModel = require("../models/drivers");

exports.getDashboard = async (req, res, next) => {
  try {
    const driver = await driverModel.getDriverByUserID(req.user.UserID);
    const driverStatus = await driverModel.getDriverStatus(req.user.UserID);
    const activeDeliveries = await driverModel.getActiveOrders(driver.DriverID);
    const order = await driverModel.getCurrentOrder(req.user.UserID);
    const completedDeliveries = await driverModel.getCompletedOrders(
      driver.DriverID,
    );
    res.render("drivers/driver-dashboard", {
      user: req.user,
      activeDeliveries,
      completedDeliveries,
      driverStatus,
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentOrder = async (req, res, next) => {
  try {
    const driver = await driverModel.getDriverByUserID(req.user.UserID);
    const driverStatus = await driverModel.getDriverStatus(req.user.UserID);
    const order = await driverModel.getCurrentOrder(req.user.UserID);
    console.log("getCurrentOrder result:", order);

    let items = [];
    if (order) {
      [items] = await Promise.all([driverModel.getOrderItems(order.OrderID)]);
    }
    res.render("drivers/driver-current-order", {
      user: req.user,
      order,
      items,
      driver,
      driverStatus,
      // TODO: add messaging feature to this
    });
  } catch (err) {
    next(err);
  }
};
exports.getEarnings = (req, res) =>
  res.render("drivers/driver-earnings", { user: req.user });
exports.getHistory = (req, res) =>
  res.render("drivers/driver-order-history", { user: req.user });
exports.getProfile = (req, res) =>
  res.render("shared/profile", { user: req.user });
