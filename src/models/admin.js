const db = require('../config/db');

/**
 * TODO:
 * need db queries for: 
 * ban user/change status
 * moderate content/remove posts 
 * approve vendors 
 * revenue data/info
 * resolve disputes 
 */

function getVendorByID(MerchantID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Merchants WHERE MerchantID = ?', MerchantID, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getDriverByID(DriverID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Drivers WHERE DriverID = ?', DriverID, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// set vendor to verified
function approveVendor(MerchantID) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Merchants SET Verified = 'Approved' WHERE MerchantID = ?`, [MerchantID], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

function rejectVendor(MerchantID) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Merchants SET Verified = 'Rejected' WHERE MerchantID = ?`, [MerchantID], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// ban user
function banUser(UserID) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Users SET Status = 1 WHERE UserID = ?`, [UserID], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// re-instate user
function reinstateUser(UserID) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Users SET Status = 0 WHERE UserID = ?`, [UserID], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// suspend user
function suspendUser(UserID) {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE Users SET Status = 2 WHERE UserID = ?`, [UserID], function(err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

// get all disputes with order and customer/merchant info
function getAllDisputes() { // pulling info from multiple tables here
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT 
                dispute_table.DisputeID,
                dispute_table.OrderID,
                dispute_table.Description,
                dispute_table.Status,
                dispute_table.CreatedAt,
                order_table.TotalAmount,
                user_customer_table.First_name AS CustomerFirstName,
                users_customers.Last_name AS CustomerLastName,
                users_merchants.First_name AS MerchantFirstName,
                users_merchants.Last_name AS MerchantLastName
            FROM Disputes dispute_table
            JOIN Orders order_table ON dispute_table.OrderID = order_table.OrderID
            JOIN Customers customersTable ON order_table.CustomerID = customersTable.CustomerID
            JOIN Users users_customers ON customersTable.UserID = users_customers.UserID
            JOIN Merchants merchant_table ON order_table.MerchantID = merchant_table.MerchantID
            JOIN Users users_merchants ON merchant_table.UserID = users_merchants.UserID
            ORDER BY dispute_table.CreatedAt DESC
        `, (err, rows) => {
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
            function(err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

module.exports = { banUser, suspendUser, reinstateUser, approveVendor, rejectVendor, getDriverByID, getVendorByID, getAllDisputes, updateDisputeStatus };