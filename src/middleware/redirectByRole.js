module.exports = {
  dashRedirect: (res, role) => {
    const dashboardRoutes = {
      admin: "/admins/dashboard",
      vendor: "/vendors/dashboard",
      driver: "/drivers/dashboard",
      customer: "/customers/dashboard",
    };
    res.redirect(dashboardRoutes[role.toLowerCase()]);
  },
};
