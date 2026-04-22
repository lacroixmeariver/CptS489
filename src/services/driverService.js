const driverModel = require("../models/drivers");

class DriverService {
  async setDriverStatus(user, isOnline, emit) {
    if (isOnline) {
      await driverModel.setDriverOnline(user.UserID);
    } else {
      await driverModel.setDriverOffline(user.UserID);
    }

    emit("driver:status:update", {
      user: user,
      isOnline: isOnline,
    });
  }

  async populateQueue(order, emit) {
    console.log(
      "populateQueue order keys:",
      Object.keys(order),
      "orderId:",
      order.orderId,
      "OrderID:",
      order.OrderID,
    );
    const driver = await driverModel.getAvailableDriver();
    if (!driver) return;
    emit("driver:order_offer", { driver, order });
  }

  async acceptOrder(user, orderId, emit) {
    const driver = await driverModel.getDriverByUserID(user.UserID);
    // console.log(
    //   "acceptOrder - driver:",
    //   driver,
    //   "orderId:",
    //   orderId,
    //   typeof orderId,
    // );
    if (!driver) return;

    await driverModel.assignOrderToDriver(
      parseInt(orderId),
      driver.DriverID,
      user.UserID,
    );
    // console.log("assignOrderToDriver complete");
    emit("driver:order_assigned", { orderId });
  }

  async rejectOrder(user, orderId, emit) {
    const order = { OrderID: orderId };
    const nextDriver = await driverModel.getAvailableDriver(user.UserID); // exclude rejecter
    if (nextDriver) {
      emit("driver:order_offer", { driver: nextDriver, order });
    }
  }

  async updateDeliveryStatus(user, orderId, status, emit) {
    await driverModel.updateOrderStatus(orderId, user.DriverID, status);
    if (status === "Completed") {
      await driverModel.clearCurrentOrder(user.UserID);
    }
    emit("order_status_changed", { orderId, status });
  }
}

module.exports = new DriverService();
