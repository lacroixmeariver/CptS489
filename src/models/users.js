const { db, dbPromise } = require("../config/db");

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Users WHERE Email = ?", email, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getUserByID(ID) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Users WHERE UserID = ?", ID, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getUserIDByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get("SELECT UserID FROM Users WHERE Email = ?", email, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row.UserID : null);
    });
  });
}

function getUsersByFirstName(firstName) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM Users WHERE First_name = ?",
      firstName,
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row : null);
      },
    );
  });
}

function getUsersByEmail(email) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Users WHERE Email = ?", email, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row : null);
    });
  });
}

// transaction for inserting user into users table and then role specific table
function addUser(data, additionalInfo) {
  return new Promise((resolve, reject) => {
    console.log("Info", additionalInfo);
    db.serialize(() => {
      // serialize/serialize mode runs one statement at a time
      db.run("BEGIN TRANSACTION");

      // inserting into user table
      db.run(
        `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role, Status, Phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.email,
          data.hashedPassword,
          data.salt,
          data.firstName,
          data.lastName,
          data.role,
          data.status,
          data.phoneNumber,
        ],
        function (err) {
          // has to be regular function and not an arrow func to be able to use this.lastID
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          // saves the last inserted user id
          const userID = this.lastID;

          const userRole = data.role.toLowerCase();
          if (userRole === "vendor") {
            db.run(
              "INSERT INTO Merchants (UserID, MerchantName, MerchantAddress) VALUES (?, ?, ?)",
              [
                userID,
                additionalInfo.merchantName,
                additionalInfo.merchantAddress,
              ],
              (err) => {
                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }
                db.run("COMMIT");
                resolve(userID);
              },
            );
          } else if (userRole === "driver") {
            db.run(
              "INSERT INTO Drivers (UserID, LicensePlateNumber, DriversLicenseNumber, VehicleMake, VehicleModel, VehicleColor) VALUES (?, ?, ?, ?, ?, ?)",
              [
                userID,
                additionalInfo.licensePlateNumber,
                additionalInfo.driversLicenseNumber,
                additionalInfo.vehicleMake,
                additionalInfo.vehicleModel,
                additionalInfo.vehicleColor,
              ],
              (err) => {
                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }
                db.run("COMMIT");
                resolve(userID);
              },
            );
          } else if (userRole === "customer" || userRole === "admin") {
            db.run(
              "INSERT INTO Customers (UserID) VALUES (?)",
              [userID],
              (err) => {
                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }
                db.run("COMMIT");
                resolve(userID);
              },
            );
          } else {
            db.run("ROLLBACK");
            reject(new Error(`Invalid role: ${userRole}`));
          }
        },
      );
    });
  });
}

function getAllUserInfo() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT UserID, Email, First_name, Last_name, Role, Status, FORMAT(Created_at, 'MM-DD-YYYY hh:mm:ss') FROM Users",
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

// for editing a user profile
function updateUser(UserID, { firstName, lastName, phoneNumber }) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Users SET First_name = ?, Last_name = ?, Phone_number = ? WHERE UserID = ?`,
      [firstName, lastName, phoneNumber, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// for updating a user's password
function updatePassword(UserID, newHash, newSalt) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Users SET Password_hash = ?, Salt = ? WHERE UserID = ?`,
      [newHash, newSalt, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

module.exports = {
  findUserByEmail,
  getUserIDByEmail,
  getUserByID,
  addUser,
  getAllUserInfo,
  getUsersByFirstName,
  getUsersByEmail,
  updateUser,
  updatePassword,
};
