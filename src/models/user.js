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

function getUsersByFirstName(firstName) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Users WHERE First_name = ?', firstName, (err, row) => {
            if (err) reject(err);
            else resolve(row ? row : null);
        });
    });
}

function getUsersByEmail(email) {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Users WHERE Email = ?', email, (err, row) => {
            if (err) reject(err);
            else resolve(row ? row : null);
        });
    });
}

// transaction for inserting user into users table and then role specific table
function addUser(data) {
    return new Promise((resolve, reject) => {
        db.serialize(() => { // serialize/serialize mode runs one statement at a time
            db.run('BEGIN TRANSACTION');

            // inserting into user table
            db.run(
            `INSERT INTO Users (Email, Password_hash, Salt, First_name, Last_name, Role, Status, Phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.email, data.hashedPassword, data.salt, data.firstName, data.lastName, data.role, data.status, data.phoneNumber],
            function(err) { // has to be regular function and not an arrow func to be able to use this.lastID
                if (err) { 
                    db.run('ROLLBACK'); 
                    return reject(err);
                }

                // saves the last inserted user id 
                const userID = this.lastID;
                
                const userRole = data.role.toLowerCase();
                if (userRole === 'vendor') {
                    db.run(
                        'INSERT INTO Merchants (UserID, MerchantName) VALUES (?, ?)',
                        [userID, 'test name'], // dummy data for now 
                        // TODO: set up merchant sign in
                        (err) => {
                            if (err) { db.run('ROLLBACK'); return reject(err); }
                            db.run('COMMIT');
                            resolve(userID);
                        }
                    );
                // } //TODO: Set up driver sign in
                //else if (userRole === 'driver' ) {
                //     db.run(
                //         'INSERT INTO Drivers (LicensePlateNumber, DriversLicenseNumber) VALUES (?, ?)',
                //         [LicensePlateNumber, DriversLicenseNumber],
                //         (err) => {
                //             if (err) { db.run('ROLLBACK'); return reject(err); }
                //             db.run('COMMIT');
                //             resolve(userID);
                //         }
                //     );
                } else if (userRole === 'customer' || userRole === 'admin' ) {
                    db.run(
                        'INSERT INTO Customers (UserID) VALUES (?)',
                        [userID],
                        (err) => {
                            if (err) { db.run('ROLLBACK'); return reject(err); }
                            db.run('COMMIT');
                            resolve(userID);
                        }
                    ); 
                } else {
                    db.run('ROLLBACK');
                    reject(new Error(`Invalid role: ${userRole}`));
                }
            }
        );

        })
        
    });
}

function createVendor(data) {
    return new Promise((resolve, reject) => {
        
    })
}

function createCustomer() {
    return new Promise((resolve, reject) => {
        
    })
}

function createDriver() {
    return new Promise((resolve, reject) => {
        
    })
}

function getAllUserInfo() {
    return new Promise((resolve, reject) => {
        db.all('SELECT UserID, Email, First_name, Last_name, Role, Status, FORMAT(Created_at, \'MM-DD-YYYY hh:mm:ss\') FROM Users', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

module.exports = {
    findUserByEmail, getUserIDByEmail, getUserByID, addUser, getAllUserInfo, getUsersByFirstName, getUsersByEmail
};