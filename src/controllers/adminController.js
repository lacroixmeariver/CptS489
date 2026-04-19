const userModel = require("../models/users");
const adminModel = require("../models/admins");
const vendorModel = require("../models/vendors");
const { isSelf } = require("../service/isSelf");

/**
 * @brief dictionary/map to help with switching between search queries
 */
const searchByMapping = {
  userId: (val) => userModel.getUserByID(val),
  username: (val) => userModel.getUsersByFirstName(val),
  email: (val) => userModel.getUsersByEmail(val),
};

/**
 * @brief dictionary/map to help with switching between search queries for vendors
 */
const searchVendorByMapping = {
  userId: (val) => vendorModel.getVendorByID(val),
  username: (val) => vendorModel.getVendorsByFirstName(val),
  email: (val) => vendorModel.getVendorsByEmail(val),
};

// GET operations  ------------------------------------------------------------

exports.getDashboard = async (req, res, next) => {
  try {
    const [newUsers, userSum] = await Promise.all([
      adminModel.getUsersAddedWithin(),
      adminModel.getNewUsersSum(),
    ]);
    res.render("admins/admin-dashboard", { user: req.user, newUsers, userSum });
  } catch (err) {
    next(err);
  }
};

exports.getManageUsers = async (req, res, next) => {
  try {
    const { searchBy, targetUser } = req.query;
    let users;
    if (targetUser) {
      const handler = searchByMapping[searchBy] ?? searchByMapping["userId"];
      users = await handler(targetUser);
      if (!Array.isArray(users)) users = users ? [users] : [];
    } else {
      users = await userModel.getAllUserInfo();
    }
    res.render("admins/manage-user", {
      user: req.user,
      users,
      targetUser,
      searchBy,
      reason: req.query.reason,
    });
  } catch (err) {
    next(err);
  }
};

exports.getVendorApplications = async (req, res, next) => {
  try {
    const { searchBy, targetVendor } = req.query;
    let vendors;
    if (targetVendor) {
      const handler =
        searchVendorByMapping[searchBy] ?? searchVendorByMapping["userId"];
      vendors = await handler(targetVendor);
      if (!Array.isArray(vendors)) vendors = vendors ? [vendors] : [];
    } else {
      vendors = await vendorModel.getAllVendorInfo();
    }
    res.render("admins/vendor-applications", {
      user: req.user,
      vendors,
      targetVendor,
      searchBy,
      reason: req.query.reason,
    });
  } catch (err) {
    next(err);
  }
};

exports.getIssues = async (req, res, next) => {
  try {
    const disputes = await adminModel.getAllDisputes();
    res.render("admins/disputes", { user: req.user, disputes });
  } catch (err) {
    next(err);
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const targetUser = await userModel.getUserByID(req.query.modalUserID);
    res.render("admins/admins-user-detail", { user: req.user, targetUser });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = (req, res) =>
  res.render("shared/profile", { user: req.user });


// POST operations ------------------------------------------------------------

exports.banUser = async (req, res, next) => {
  if (isSelf(req, req.params.userID))
    return res.redirect("/admins/manage-users?reason=self-ban");
  try {
    await adminModel.banUser(req.params.userID);
    res.redirect("/admins/manage-users");
  } catch (err) {
    next(err);
  }
};

exports.suspendUser = async (req, res, next) => {
  if (isSelf(req, req.params.userID))
    return res.redirect("/admins/manage-users?reason=self-suspend");
  try {
    await adminModel.suspendUser(req.params.userID);
    res.redirect("/admins/manage-users");
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  if (isSelf(req, req.params.userID))
    return res.redirect("/admins/manage-users?reason=self-suspend");
  try {
    await adminModel.deleteUser(req.params.userID);
    res.redirect("/admins/manage-users");
  } catch (err) {
    next(err);
  }
};

exports.reinstateUser = async (req, res, next) => {
  try {
    await adminModel.reinstateUser(req.params.userID);
    res.redirect("/admins/manage-users");
  } catch (err) {
    next(err);
  }
};

exports.resolveDispute = async (req, res, next) => {
  try {
    await adminModel.updateDisputeStatus(req.params.disputeID);
    res.redirect("/admins/issues");
  } catch (err) {
    next(err);
  }
};

exports.appealDispute = async (req, res, next) => {
  try {
    await adminModel.updateDisputeStatus(req.params.disputeID);
    res.redirect("/admins/issues");
  } catch (err) {
    next(err);
  }
};

exports.approveVendor = async (req, res, next) => {
  try {
    await adminModel.approveVendor(req.params.vendorID);
    res.redirect("/admins/vendor-applications");
  } catch (err) {
    next(err);
  }
};

exports.rejectVendor = async (req, res, next) => {
  try {
    await adminModel.rejectVendor(req.params.vendorID);
    res.redirect("/admins/vendor-applications");
  } catch (err) {
    next(err);
  }
};
