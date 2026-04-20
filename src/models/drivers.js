const {db, dbPromise} = require('../config/db');

// returns a count representing the amount of active orders a driver is assigned to
function getActiveOrders(DriverID) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM Orders WHERE AssignedDriverID = ? AND (OrderStatus = 'Accepted' OR OrderStatus = 'Ready For Pickup' OR OrderStatus = 'Pending')`,
      [DriverID],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        } else resolve(row.count);
      },
    );
  });
}

function getCompletedOrders(DriverID) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM Orders WHERE AssignedDriverID = ? AND OrderStatus = 'Completed'`,
      [DriverID],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        } else resolve(row.count);
      },
    );
  });
}

function getDriverByID(DriverID) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Drivers WHERE DriverID = ?",
      [DriverID],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

function getDriverByUserID(UserID) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Drivers WHERE UserID = ?", [UserID], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function updateLicensePlate(UserID, plateNumber) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Drivers SET LicensePlateNumber = ? WHERE UserID = ?`,
      [plateNumber, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

function updateVehicleInfo(UserID, vehicleMake, vehicleModel, vehicleColor) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Drivers SET VehicleMake = ?, VehicleModel = ?, VehicleColor = ? WHERE UserID = ?`,
      [vehicleMake, vehicleModel, vehicleColor, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

module.exports = {
  getActiveOrders,
  getDriverByID,
  getDriverByUserID,
  getCompletedOrders,
  updateLicensePlate,
  updateVehicleInfo,
};
