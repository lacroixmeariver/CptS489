const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const userModel = require("../models/user");
const createUser = require("../service/createUser");
const redirectByRole = require("../middleware/redirectByRole");
const MerchantRepository = require("../middleware/merchantRepository");
const Merchant = require("../backend/models/merchant");
const { dbPromise, db } = require("../config/db");
const Customer = require("../backend/models/customer");
const CustomerRepository = require("../middleware/customerRepository");
// GET routes ----------------------------------------------
router.get("/login", authController.getLogin);
router.get("/forgot-password", (req, res) =>
  res.render("auth/forgot-password", { title: "Forgot Password" }),
);
router.get("/logout", authController.logout);
router.get("/register", authController.getRegister);

// POST routes ----------------------------------------------
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

module.exports = router;
