const db = require("../config/db");

// gets a row from the merchants table via vendor id
function getVendorByID(MerchantID) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Merchants WHERE MerchantID = ?",
      MerchantID,
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

// get a vendor via user id
function getMerchantByUserID(UserID) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM Merchants WHERE UserID = ?`, [UserID], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// gets all the vendors matching a first name query
function getVendorsByFirstName(firstName) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM Merchants WHERE First_name = ?",
      firstName,
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row : null);
      },
    );
  });
}

// gets all the vendors matching an email query
function getVendorsByEmail(email) {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Merchants WHERE Email = ?", email, (err, row) => {
      if (err) reject(err);
      else resolve(row ? row : null);
    });
  });
}

// gets every row in merchant table
function getAllVendorInfo() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM Merchants", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// for updating a merchant entry
function updateMerchant(UserID, { merchantName, merchantAddress }) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE Merchants SET MerchantName = ?, MerchantAddress = ? WHERE UserID = ?`,
      [merchantName, merchantAddress, UserID],
      function (err) {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

module.exports = {
  getVendorByID,
  getVendorsByEmail,
  getVendorsByFirstName,
  getAllVendorInfo,
  updateMerchant,
  getMerchantByUserID,
};
