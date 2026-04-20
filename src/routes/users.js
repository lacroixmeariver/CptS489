var express = require("express");
var router = express.Router();
const { isAuthenticated } = require("../middleware/isAuth");
const { isBanned } = require("../middleware/checkUserStatus");
const { getUserPage } = require("../controllers/userController");

// gets the user page
// routes according to user type
router.get("/users", isAuthenticated, getUserPage);

module.exports = router;
