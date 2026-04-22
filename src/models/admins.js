const { db, dbPromise } = require("../config/db");

// set vendor to verified
function approveVendor(MerchantID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Merchants SET Verified = 'Approved' WHERE MerchantID = ?`,
      [MerchantID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// sets vendor to rejected
function rejectVendor(MerchantID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Merchants SET Verified = 'Rejected' WHERE MerchantID = ?`,
      [MerchantID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// ban user
function banUser(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Users SET Status = 1 WHERE UserID = ?`,
      [UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// re-instate user
function reinstateUser(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Users SET Status = 0 WHERE UserID = ?`,
      [UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// suspend user
function suspendUser(UserID) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Users SET Status = 2 WHERE UserID = ?`,
      [UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// get all disputes with order and customer/merchant info
function getAllDisputes() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM Disputes`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// update dispute status
function updateDisputeStatus(DisputeID, newStatus) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Disputes SET Status = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE DisputeID = ?`,
      [newStatus, DisputeID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

// permanently deletes a user
function deleteUser(userID) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM Users WHERE UserID = ?`, [userID], function (err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

// gets all users added within a certain range
function getUsersAddedWithin(days = 30) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM Users WHERE Created_at >= datetime('now', '-' || ? || ' days')`,
      [days],
      function (err, rows) {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

// gets the sum of all users added within a certain range
function getNewUsersSum(days = 30) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT (*) as count FROM Users WHERE Created_at >= datetime('now', '-' || ? || ' days')`,
      [days],
      (err, row) => {
        if (err) reject(row);
        else resolve(row.count);
      },
    );
  });
}

module.exports = {
  banUser,
  suspendUser,
  reinstateUser,
  approveVendor,
  rejectVendor,
  getAllDisputes,
  updateDisputeStatus,
  deleteUser,
  getUsersAddedWithin,
  getNewUsersSum,
};
