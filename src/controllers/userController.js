const userModel = require("../models/users");

module.exports = {
    routeToUserDash: async (req, res, next) => {
        try {
            const role = req.user.Role.toLowerCase();
            if (role === "admin") {
            res.redirect("/admins/dashboard");
            } else if (role === "vendor") {
            res.redirect("/vendors/dashboard");
            } else if (role === "driver") {
            res.redirect("/drivers/dashboard");
            } else // defaults to customer dash
            {
            res.redirect("/customers/dashboard");
            }
        } catch (err) {
            next(err);
        }
    }, 

}

