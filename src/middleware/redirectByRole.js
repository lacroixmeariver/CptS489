module.exports = {
  dashRedirect: (res, role) => {
    const dashboardRoutes = {
      admin: "/admins/dashboard",
      vendor: "/vendors/dashboard",
      driver: "/drivers/dashboard",
    };
    res.redirect(dashboardRoutes[role.toLowerCase()] || "/customers/dashboard");
  },
};
