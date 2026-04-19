const vendorModel = require("../models/vendors");

exports.getDashboard = async (req, res, next) => {
  try {
    const driver = await vendorModel.getMerchantByUserID(req.user.UserID);
    res.render("vendors/merchant-dashboard", {
      user: req.user,
      activeDeliveries,
      completedDeliveries,
    });
  } catch (err) {
    next(err);
  }
};
