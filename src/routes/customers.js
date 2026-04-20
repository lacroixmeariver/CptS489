var express = require("express");
var router = express.Router();
const { isAuthenticated } = require("../middleware/isAuth");
const db = require("../config/db");

// get the customer dashboard page
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("customers/customer-dashboard", { user: req.user });
});

router.get("/order-history", isAuthenticated, (req, res) => {
  res.render("customers/customer-order-history", { user: req.user });
});

router.get("/order-history", isAuthenticated, (req, res) => {
  res.render("customers/customer-order-history", { user: req.user });
});

router.get("/order-status", isAuthenticated, (req, res) => {
  res.render("customers/customer-order-status", { user: req.user });
});

router.get("/reviews", isAuthenticated, (req, res) => {
  res.render("customers/customer-reviews", { user: req.user });
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("shared/profile", { user: req.user });
});

router.get("/cart", isAuthenticated, (req, res) => {
  res.render("customers/cart", { user: req.user });
});

router.get("/checkout", isAuthenticated, (req, res) => {
  res.render("customers/checkout", { user: req.user });
});

module.exports = router;
