// navbar for consistency among all pages where it's appropriate
// displays username
const navbar = (userName) => `
<nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
        <a href="/users" class="navbar-brand">
            <img id="navbar-logo-img" src="/images/homeplate-logo-transparent.png" alt="">
            <h1 id="navbar-header-text">HomePlate</h1>
        </a>
        ${userName ? `<span class="navbar-greeting">Hello, <a href="/profile">${userName}</a></span>` : ""}
        <a class="nav-item nav-link m-2" id="cart-button" href="/customers/cart" hidden>
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
        <a href="/admins/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admins/manage-users" data-bs-toggle="tooltip" data-bs-placement="right" title="User Management">
            <i class="bi bi-people-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admins/issues" data-bs-toggle="tooltip" data-bs-placement="right" title="Issues">
            <i class="bi bi-exclamation-triangle-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/admins/vendor-applications" data-bs-toggle="tooltip" data-bs-placement="right" title="Applications">
            <i class="bi bi-pencil-square sidebar-nav-link-icon"></i>
        </a>
        <a href="/admins/revenue" data-bs-toggle="tooltip" data-bs-placement="right" title="Revenue">
            <i class="bi bi-graph-up sidebar-nav-link-icon"></i>
        </a>
        <a href="/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// vendor sidebar with appropriate links
const cookSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/vendor/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/vendor/my-menu" data-bs-toggle="tooltip" data-bs-placement="right" title="My Menu">
            <i class="bi bi-journal-text sidebar-nav-link-icon"></i>
        </a>
        <a id="store-toggle-link" href="/vendor/open-store" data-bs-toggle="tooltip" data-bs-placement="right" title="Open Store">
            <i id="store-toggle-icon" class="bi bi-bag sidebar-nav-link-icon"></i>
        </a>
        <a href="/vendor/reports" data-bs-toggle="tooltip" data-bs-placement="right" title="Reports">
            <i class="bi bi-bar-chart-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// driver sidebar with appropriate links
const driverSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/drivers/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        
        <a href="/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// customer sidebar with appropriate links
const customerSidenav = `
<div class="sidebar-container">
    <nav class="sidebar-nav">
        <a href="/customers/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard">
            <i class="bi bi-house-fill sidebar-nav-link-icon"></i>
        </a>
        <a href="/customer/browse" data-bs-toggle="tooltip" data-bs-placement="right" title="Browse">
            <i class="bi bi-search sidebar-nav-link-icon"></i>
        </a>
        <a href="/customer/dashboard" data-bs-toggle="tooltip" data-bs-placement="right" title="My Orders">
            <i class="bi bi-bag sidebar-nav-link-icon"></i>
        </a>
        <a href="/profile" data-bs-toggle="tooltip" data-bs-placement="right" title="My Account">
            <i class="bi bi-person-circle sidebar-nav-link-icon"></i>
        </a>
    </nav>
</div>
`;

// function to obtain user role
function getSidenav(role) {
    if (role === 'admin')  return adminSidenav;
    if (role === 'vendor' || role === 'cook') return cookSidenav;
    if (role === 'driver') return driverSidenav;
    return customerSidenav;
}

// function to insert content
document.addEventListener("DOMContentLoaded", function () {
    const role = document.body.dataset.role;
    const userName = document.body.dataset.user;

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

    // For vendors: fetch store status and update sidenav + dashboard card icon
    if (role === 'vendor') {
        fetch('/vendors/api/store-status')
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data) return;
                const isOpen = data.status === 'open';

                // Sidenav toggle link
                const toggleLink = document.getElementById('store-toggle-link');
                const toggleIcon = document.getElementById('store-toggle-icon');
                if (toggleLink && toggleIcon) {
                    toggleLink.href = isOpen ? '/vendor/close-store' : '/vendor/open-store';
                    toggleLink.title = isOpen ? 'Close Store' : 'Open Store';
                    toggleIcon.className = isOpen
                        ? 'bi bi-bag-check-fill sidebar-nav-link-icon'
                        : 'bi bi-bag sidebar-nav-link-icon';
                }

                // Dashboard "Open Store" card icon
                const dashCard = document.querySelector('a[href="/vendor/open-store"] .card-img-top i, a[href="/vendor/close-store"] .card-img-top i');
                const dashCardLink = document.querySelector('a[href="/vendor/open-store"], a[href="/vendor/close-store"]');
                if (dashCardLink) {
                    dashCardLink.href = isOpen ? '/vendor/close-store' : '/vendor/open-store';
                    const cardText = dashCardLink.querySelector('.card-text');
                    if (cardText) cardText.textContent = isOpen ? 'Close Store' : 'Open Store';
                }
                if (dashCard) {
                    dashCard.className = isOpen
                        ? 'bi bi-bag-check-fill'
                        : 'bi bi-house-fill';
                    dashCard.style.fontSize = '2.5rem';
                    dashCard.style.color = '#fff';
                }
            })
            .catch(() => {});
    }
});
