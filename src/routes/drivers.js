const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuth");
const driverController = require("../controllers/driverController");

// GET routes ------------------------------------------------
router.get("/dashboard", isAuthenticated, driverController.getDashboard);
router.get("/current-order", isAuthenticated, driverController.getCurrentOrder);
router.get("/earnings", isAuthenticated, driverController.getEarnings);
router.get("/history", isAuthenticated, driverController.getHistory);

module.exports = router;
