const { db, dbPromise } = require('../config/db');

/**
 * TODO:
 * need db queries for: 
 * ban user/change status
 * moderate content/remove posts 
 * approve vendors 
 * revenue data/info
 * resolve disputes 
 */

function getVendorByID(MerchantID, cb){
    db
    .get('SELECT * FROM Merchants WHERE MerchantID = ?',
        MerchantID, (err, row) => {
        if (err) return cb(err);
        cb(null, row);
    });
}

function getDriverByID(DriverID, cb) {
    db
    .get('SELECT * FROM Drivers WHERE DriverID = ?',
        DriverID, (err, row) => {
        if (err) return cb(err);
        cb(null, row);
    });
}

// set vendor to valid 
function setMerchantStatusToValid(MerchantID, cb){
    db
    .run(`UPDATE Merchants SET Verified = TRUE WHERE MerchantID = ?`, MerchantID);
}

// un-ban user
function setMerchantStatusToValid(MerchantID, cb){
    db
    .run(`UPDATE Merchants SET Verified = TRUE WHERE MerchantID = ?`, MerchantID);
}




module.exports = {

}