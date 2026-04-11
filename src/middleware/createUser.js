const crypto = require('crypto');
const userModel = require('../models/user');

async function createUser(data, cb) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(data.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) return next(err);
        return hashedPassword.toString('hex');
        })
    const user = { // user object to then give to userModel
        email: data.email, 
        hashedPassword: hashedPassword, 
        salt, 
        firstName: data.firstName, 
        lastName: data.lastName, 
        role: data.role, 
        status: 0, 
        phoneNumber: data.phoneNumber
    };

    userModel.addUser(user, (err, userID) => { // returns the last inserted user ID 
        if (err) return cb(err);
        cb(null, userID);
    });
} 

module.exports = {
    createUser
}