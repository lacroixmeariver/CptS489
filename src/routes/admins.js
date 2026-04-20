const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/isAuth");
const adminController = require("../controllers/adminController");
const { getRevenuePage } = require("../controllers/adminRevenueController");

// GET routes ----------------------------------------------

router.get("/dashboard", isAuthenticated, adminController.getDashboard);
router.get("/manage-users", isAuthenticated, adminController.getManageUsers);
router.get(
  "/vendor-applications",
  isAuthenticated,
  adminController.getVendorApplications,
);
router.get("/issues", isAuthenticated, adminController.getIssues);
router.get("/user-detail", isAuthenticated, adminController.getUserDetail);
router.get("/revenue", isAuthenticated, isAdmin, getRevenuePage);

// POST routes ----------------------------------------------

router.post("/ban-user/:userID", isAuthenticated, adminController.banUser);
router.post(
  "/suspend-user/:userID",
  isAuthenticated,
  adminController.suspendUser,
);
router.post(
  "/delete-user/:userID",
  isAuthenticated,
  adminController.deleteUser,
);
router.post(
  "/reinstate-user/:userID",
  isAuthenticated,
  adminController.reinstateUser,
);
router.post(
  "/resolve-dispute/:disputeID",
  isAuthenticated,
  adminController.resolveDispute,
);
router.post(
  "/appeal-dispute/:disputeID",
  isAuthenticated,
  adminController.appealDispute,
);
router.post(
  "/approve-app/:vendorID",
  isAuthenticated,
  adminController.approveVendor,
);
router.post(
  "/reject-app/:vendorID",
  isAuthenticated,
  adminController.rejectVendor,
);

module.exports = router;
