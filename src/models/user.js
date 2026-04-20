const {db, dbPromise} = require('../config/db');

// queries the db for user row using email
function findUserByEmail(email, cb) {
    console.log("FIND USER BY EMAIL FUNCTION CALLED!")
    db
    .get('SELECT * FROM Users WHERE Email = ?',
        email, (err, row) => {
        if (err) return cb(err);
        cb(null, row);
    });
}

function getUserByID(ID, cb) {
    console.log("GET USER BY ID FUNCTION CALLED!")
    db
    .get('SELECT * FROM Users WHERE UserID = ?',
        ID, (err, row) => {
        if (err) return cb(err);
        cb(null, row);
    });
}

function getUserIDByEmail(email, cb) {
    db
    .get('SELECT UserID FROM Users WHERE Email = ?',
        email, (err, row) => {
        if (err) return cb(err);
        cb(null, row ? row.UserID : null);
    });
}

function addUser(data, cb) {
    db
    .run(
        `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role,  Status, Phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [data.email, data.hashedPassword, data.salt, data.firstName, data.lastName, data.role, data.status, data.phoneNumber], function(err) {
        if (err) return cb(err);
        cb(null, this.lastID ? this.lastID : null); // returns the last ID to be put into db
    });
}

module.exports = {
    findUserByEmail, getUserIDByEmail, getUserByID, addUser
};