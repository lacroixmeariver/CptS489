const crypto = require("crypto");
const userModel = require("../models/users");

async function createUser(data, additionalInfo) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(data.password, salt, 310000, 32, "sha256")
    .toString("hex");

  const user = {
    email: data.email,
    hashedPassword,
    salt,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role.toLowerCase(),
    status: 0,
    phoneNumber: data.phoneNumber,
  };

  let additionalRoleDetails;

  // roles that need some more context
  if (user.role === "driver") {
    additionalRoleDetails = {
      licensePlateNumber: additionalInfo.licensePlateNumber,
      driversLicenseNumber: additionalInfo.driversLicenseNumber,
      vehicleMake: additionalInfo.vehicleMake,
      vehicleModel: additionalInfo.vehicleModel,
      vehicleColor: additionalInfo.vehicleColor,
    };
  } else if (user.role === "vendor") {
    additionalRoleDetails = {
      merchantName: additionalInfo.merchantName,
      merchantAddress: additionalInfo.merchantAddress,
    };
  }

  const extraInfo = additionalRoleDetails;
  const userID = await userModel.addUser(user, extraInfo);
  return userID;
}

module.exports = { createUser };
