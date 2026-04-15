const db = require('../config/db');

function getVendorByID(MerchantID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Merchants WHERE MerchantID = ?', MerchantID, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getVendorsByFirstName(firstName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Merchants WHERE First_name = ?', firstName, (err, row) => {
            if (err) reject(err);
            else resolve(row ? row : null);
        });
    });
}

function getVendorsByEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Merchants WHERE Email = ?', email, (err, row) => {
            if (err) reject(err);
            else resolve(row ? row : null);
        });
    });
}

function getAllVendorInfo() {
    return new Promise((resolve, reject) => {
        db.all('SELECT MerchantID, UserID, MerchantName, MerchantAddress, Verified, StoreScore FROM Merchants', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = { getVendorByID, getVendorsByEmail, getVendorsByFirstName, getAllVendorInfo };