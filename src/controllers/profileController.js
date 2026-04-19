const crypto = require("crypto");
const userModel = require("../models/users");
const vendorModel = require("../models/vendors");
const customerModel = require("../models/customers");
const driverModel = require("../models/drivers");

async function getProfile(req, res, next) {
  try {
    const role = req.user.Role.toLowerCase();
    let extra = null;

    if (role === "customer" || role === "admin") {
      extra = await customerModel.getCustomerByUserID(req.user.UserID);
    } else if (role === "vendor") {
      extra = await vendorModel.getMerchantByUserID(req.user.UserID);
    } else if (role === "driver") {
      extra = await driverModel.getDriverByUserID(req.user.UserID);
    }
    res.render("shared/profile", {
      user: req.user,
      extra,
      savedMsg: req.query.saved === "1",
      pwdError: null,
    });
  } catch (err) {
    next(err);
  }
}

async function postUpdateProfile(req, res, next) {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    await userModel.updateUser(req.user.UserID, {
      firstName,
      lastName,
      phoneNumber,
    });
    req.user.firstName = firstName;
    req.user.lastName = lastName;
    req.user.phoneNumber = phoneNumber;

    const role = req.user.Role.toLowerCase();
    if (role === "vendor") {
      const { merchantName, merchantAddress } = req.body;
      await vendorModel.updateMerchant(req.user.UserID, {
        merchantName,
        merchantAddress,
      });
    } else if (role === "customer") {
      const { address } = req.body;
      await customerModel.updateCustomerAddress(req.user.UserID, address);
    } else if (role === "driver") {
      const { vehicleMake, vehicleModel, vehicleColor } = req.body;
      await driverModel.updateVehicleInfo(
        req.user.UserID,
        vehicleMake,
        vehicleModel,
        vehicleColor,
      );
    }

    res.redirect("/profile?saved=1");
  } catch (err) {
    next(err);
  }
}

async function postChangePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.getUserByID(req.user.UserID);

    // password matches verification
    const currentHash = Buffer.from(user.Password_hash, "hex");
    crypto.pbkdf2(
      currentPassword,
      user.Salt,
      310000,
      32,
      "sha256",
      async (err, supplied) => {
        if (err) return next(err);
        if (!crypto.timingSafeEqual(currentHash, supplied)) {
          const extra = await customerModel
            .getCustomerByUserID(req.user.UserID)
            .catch(() => null);
          return res.render("shared/profile", {
            user: req.user,
            extra,
            pwdError: "Current password entered is incorrect.",
          });
        }

        // new password hashed with new salt 
        const newSalt = crypto.randomBytes(16).toString("hex");
        crypto.pbkdf2(
          newPassword,
          newSalt,
          310000,
          32,
          "sha256",
          async (err, newHash) => {
            if (err) return next(err);
            await userModel.updatePassword(
              req.user.UserID,
              newHash.toString("hex"),
              newSalt,
            );
            res.redirect("/profile?saved=1");
          },
        );
      },
    );
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, postUpdateProfile, postChangePassword };
