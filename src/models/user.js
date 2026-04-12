const db = require('../config/db');

function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Users WHERE Email = ?', email, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getUserByID(ID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Users WHERE UserID = ?', ID, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getUserIDByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT UserID FROM Users WHERE Email = ?', email, (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.UserID : null);
        });
    });
}

function addUser(data) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role, Status, Phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.email, data.hashedPassword, data.salt, data.firstName, data.lastName, data.role, data.status, data.phoneNumber],
            function(err) { // has to be regular function and not an arrow func to be able to use this.lastID
                if (err) reject(err);
                else resolve(this.lastID ?? null);
            }
        );
    });
}

function getAllUserInfo() {
    return new Promise((resolve, reject) => {
        db.all('SELECT UserID, Email, First_name, Last_name, Role, Status, Created_at FROM Users', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = {
    findUserByEmail, getUserIDByEmail, getUserByID, addUser, getAllUserInfo
};