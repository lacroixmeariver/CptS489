const {db, dbPromise} = require('../config/db');

function getCustomerByUserID(UserID) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Customers WHERE UserID = ?`, [UserID], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function updateCustomerAddress(UserID, address) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Customers SET Address = ? WHERE UserID = ?`,
      [address, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

module.exports = { getCustomerByUserID, updateCustomerAddress };
