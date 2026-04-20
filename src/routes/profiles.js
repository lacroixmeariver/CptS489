var express = require("express");
var router = express.Router();
const { isAuthenticated } = require("../middleware/isAuth");
const { isBanned } = require("../middleware/checkUserStatus");

const {
  getProfile,
  postUpdateProfile,
  postChangePassword,
} = require("../controllers/profileController");

// GET routes ------------------------------------------------

router.get("/profile", isAuthenticated, getProfile);
router.post("/profile/update", isAuthenticated, postUpdateProfile);
router.post("/profile/password", isAuthenticated, postChangePassword);

module.exports = router;
