const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

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
