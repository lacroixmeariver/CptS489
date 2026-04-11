
// navbar for consistency among all pages where it's appropriate
// displays username
const navbar = (userName) => `
<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <a href="/user" class="navbar-brand">
            <img id="navbar-logo-img" src="/images/homeplate-logo-transparent.png" alt="">
            <h1 id="navbar-header-text">HomePlate</h1>
        </a>
        ${userName ? `<span class="navbar-greeting">Hello, <a href="/user-profile">${userName}</a></span>` : ''}
        <a class="nav-item nav-link m-2" id="cart-button" href="/customer/cart" hidden>
            <i class="bi bi-cart3"></i>
        </a>
        <a class="m-2" id="logout-nav-button" href="/logout">
            <i class="bi bi-box-arrow-right"></i> Log Out
        </a>
    </div>
</nav>
`;

// admin sidebar with appropriate links
const adminSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/admin/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admin/manage-users" data-bs-toggle="tooltip" data-bs-placement="right" title="User Management">
            <i class="bi bi-people-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admin/issues" data-bs-toggle="tooltip" data-bs-placement="right" title="Issues">
            <i class="bi bi-exclamation-triangle-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admin/revenue" data-bs-toggle="tooltip" data-bs-placement="right" title="Revenue">
            <i class="bi bi-graph-up sidebar-nav-link-icon"></i>
        </a>
        <a href="/admin/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// vendor sidebar with appropriate links
const cookSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/cook/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/cook/menu" data-bs-toggle="tooltip" data-bs-placement="right" title="My Menu">
            <i class="bi bi-journal-text sidebar-nav-link-icon"></i>
        </a>
        <a href="/cook/orders" data-bs-toggle="tooltip" data-bs-placement="right" title="Live Orders">
            <i class="bi bi-bag-check sidebar-nav-link-icon"></i>
        </a>
        <a href="/cook/reports" data-bs-toggle="tooltip" data-bs-placement="right" title="Reports">
            <i class="bi bi-bar-chart-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/cook/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// driver sidebar with appropriate links
const driverSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/driver/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/driver/current-order" data-bs-toggle="tooltip" data-bs-placement="right" title="Current Order">
            <i class="bi bi-bicycle sidebar-nav-link-icon"></i>
        </a>
        <a href="/driver/history" data-bs-toggle="tooltip" data-bs-placement="right" title="Order History">
            <i class="bi bi-receipt sidebar-nav-link-icon"></i>
        </a>
        <a href="/driver/earnings" data-bs-toggle="tooltip" data-bs-placement="right" title="Earnings">
            <i class="bi bi-cash sidebar-nav-link-icon"></i>
        </a>
        <a href="/driver/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// customer sidebar with appropriate links
const customerSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/customer/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/browse" data-bs-toggle="tooltip" data-bs-placement="right" title="Browse">
            <i class="bi bi-search sidebar-nav-link-icon"></i>
        </a>
        <a href="/customer/order-history" data-bs-toggle="tooltip" data-bs-placement="right" title="My Orders">
            <i class="bi bi-bag sidebar-nav-link-icon"></i>
        </a>
        <a href="/customer/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// function to obtain user role 
function getSidenav(role) {
    if (role === 'admin')  return adminSidenav;
    if (role === 'cook')   return cookSidenav;
    if (role === 'driver') return driverSidenav;
    return customerSidenav;
}

// function to insert content
document.addEventListener("DOMContentLoaded", function () {
    const role = document.body.dataset.role;
    const userName = document.body.dataset.user;
    console.log('role:', role, 'userName:', userName);
    document.body.insertAdjacentHTML("afterbegin", navbar(userName));
    if (role === 'customer'){
        document.body.querySelector("#cart-button").removeAttribute("hidden");
    }
    const mainBox = document.querySelector(".main-box");
    if (mainBox) {
        mainBox.insertAdjacentHTML("afterbegin", getSidenav(role));
    }
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (el) {
        return new bootstrap.Tooltip(el);
    });
});