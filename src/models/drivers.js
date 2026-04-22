const { db, dbPromise } = require("../config/db");

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

function getCurrentOrder(UserID) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT o.*, 
              m.MerchantName, m.MerchantAddress,
              u.First_name AS CustomerFirstName, u.Last_name AS CustomerLastName,
              c.Address AS CustomerAddress,
              r.DriverTip
       FROM Orders o
       INNER JOIN Drivers d ON d.CurrentOrderAssigned = o.OrderID
       LEFT JOIN Merchants m ON m.MerchantID = o.MerchantID
       LEFT JOIN Customers c ON c.CustomerID = o.CustomerID
       LEFT JOIN Users u ON u.UserID = c.UserID
       LEFT JOIN Revenue r ON r.OrderID = o.OrderID
       WHERE d.UserID = ?`,
      [UserID],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ?? null);
      },
    );
  });
}

function updateOrderStatus(OrderID, DriverID, status) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Orders SET OrderStatus = ? WHERE OrderID = ? AND AssignedDriverID = ?`,
      [status, OrderID, DriverID],
      (err, row) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

function getOrderHistory(DriverID) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Orders WHERE AssignedDriverID = ?`,
      [DriverID],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

function setDriverOnline(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Drivers SET DriverStatus = 'Online' WHERE UserID = ?`,
      [UserID],
      (err, row) => {
        if (err) reject(err);
        else {
          console.log("Driver status: being set to on");
          resolve();
        }
      },
    );
  });
}

function setDriverOffline(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Drivers SET DriverStatus = 'Offline' WHERE UserID = ?`,
      [UserID],
      (err, row) => {
        if (err) reject(err);
        else {
          console.log("Driver status: being set to off");
          resolve();
        }
      },
    );
  });
}

function getOrderItems(OrderID) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM OrderItems WHERE OrderID = ?",
      [OrderID],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

function getDriverStatus(UserID) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT DriverStatus as status FROM Drivers WHERE UserID = ?",
      [UserID],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.status);
      },
    );
  });
}

function assignOrderToDriver(orderId, driverId, userId) {
  const orderIdInt = parseInt(orderId);
  const driverIdInt = parseInt(driverId);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `UPDATE Drivers SET CurrentOrderAssigned = ? WHERE UserID = ?`,
        [orderIdInt, userId],
        (err) => {
          if (err) console.error("Drivers update failed:", err);
          else
            console.log("Drivers.CurrentOrderAssigned updated to", orderIdInt);
        },
      );
      db.run(
        `UPDATE Orders SET AssignedDriverID = ? WHERE OrderID = ?`,
        [driverIdInt, orderIdInt],
        (err) => {
          if (err) {
            console.error("Orders update failed:", err);
            reject(err);
          } else {
            console.log("Orders.AssignedDriverID updated");
            resolve();
          }
        },
      );
    });
  });
}

function getAvailableDriver(excludeUserID = null) {
  return new Promise((resolve, reject) => {
    const sql = excludeUserID
      ? `SELECT * FROM Drivers WHERE DriverStatus = 'Online' AND CurrentOrderAssigned IS NULL AND UserID != ? LIMIT 1`
      : `SELECT * FROM Drivers WHERE DriverStatus = 'Online' AND CurrentOrderAssigned IS NULL LIMIT 1`;
    const params = excludeUserID ? [excludeUserID] : [];
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row ?? null);
    });
  });
}

function clearCurrentOrder(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Drivers SET CurrentOrderAssigned = NULL WHERE UserID = ?`,
      [UserID],
      (err) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// function getEarnings(UserID) {
//   return new Promise((resolve, reject) => {
//     db.get("SELECT SUM() WHERE OrderID FROM Drivers WHERE UserID = ?", (err, row) => {
//         if (err) reject(err);
//         else resolve();
//       })
//   });
// }

// function getMessages(UserID) {
//   return new Promise((resolve, reject) => {

//   });
// }

// function sendMessages(UserID) {
//   return new Promise((resolve, reject) => {

//   });
// }

module.exports = {
  getActiveOrders,
  getDriverByID,
  getDriverByUserID,
  getCompletedOrders,
  updateLicensePlate,
  updateVehicleInfo,
  getCurrentOrder,
  updateOrderStatus,
  getOrderHistory,
  setDriverOffline,
  setDriverOnline,
  getOrderItems,
  getDriverStatus,
  assignOrderToDriver,
  getAvailableDriver,
  clearCurrentOrder,
};
