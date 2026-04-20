const router = express.Router();
const authController = require("../controllers/authController");
var express = require('express');
var passport = require('passport');
const userModel = require('../models/user');
const createUser = require('../middleware/createUser');
const redirectByRole = require('../middleware/redirectByRole');
const MerchantRepository = require("../middleware/merchantRepository");
const Merchant = require("../backend/models/merchant")
const { dbPromise, db } = require('../config/db');
const Customer = require('../backend/models/customer');
const CustomerRepository = require('../middleware/customerRepository');

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
