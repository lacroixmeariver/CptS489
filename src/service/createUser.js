const crypto = require('crypto');
const userModel = require('../models/user');

async function createUser(data) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(data.password, salt, 310000, 32, 'sha256').toString('hex');
    
    const user = {
        email: data.email,
        hashedPassword,
        salt,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: 0,
        phoneNumber: data.phoneNumber
    };

    const userID = await userModel.addUser(user);
    return userID;
}

module.exports = { createUser };