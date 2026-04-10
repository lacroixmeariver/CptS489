
function dashRedirect(res, role) {
    const dashboardRoutes = {
        admin: '/admin/dashboard',
        cook: '/cook/dashboard',
        driver: '/driver/dashboard',
        vendor: '/vendor/dashboard'
    }
    res.redirect(dashboardRoutes[role] || '/customer/dashboard');
}

module.exports = {dashRedirect} 