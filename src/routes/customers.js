var express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/isAuth");
const db = require("../config/db");
const profileController = require("../controllers/profileController");
const MerchantRepository = require("../middleware/merchantRepository");
const MerchantService = require("../services/merhcantService");
const CustomerRepository = require("../middleware/customerRepository");
const CustomerService = require("../services/customerService");
const OrderService = require("../services/orderService");
const OrderRepository = require("../middleware/orderRepository");
const ReviewRepository = require("../middleware/reviewRepository");
const ReviewService = require("../services/reviewService");

const customerRepository = new CustomerRepository(db.dbPromise);
const customerService = new CustomerService(customerRepository);
const orderRepository = new OrderRepository(db.dbPromise);
const orderService = new OrderService(orderRepository);
const merchantRepository = new MerchantRepository(db.dbPromise);
const merchantService = new MerchantService(merchantRepository);
const reviewRepository = new ReviewRepository(db.dbPromise);
const reviewService = new ReviewService(reviewRepository);

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.user.UserID);
  const allOrders = customer
    ? await orderService.getOrdersByCustomerId(customer.customerId)
    : [];
  const totalOrders = allOrders.length;

  const database = await db.dbPromise;
  const reviewRow = customer
    ? await database.get(
        "SELECT COUNT(*) AS cnt FROM Reviews WHERE CustomerID = ?",
        [customer.customerId],
      )
    : { cnt: 0 };
  const totalReviews = reviewRow ? reviewRow.cnt : 0;

  res.render("customers/customer-dashboard", {
    user: req.user,
    totalOrders,
    totalReviews,
  });
});

router.get("/order-status", isAuthenticated, async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.user.UserID);
  const orders = await orderService.getOrdersByCustomerId(customer.customerId);
  res.render("partials/order-status", { user: req.user, orders });
});

router.get("/api/order-status/:orderId", isAuthenticated, async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);
  if (!order) return res.json({ status: "unknown" });
  const map = {
    Pending: "pending",
    Accepted: "current",
    "Ready For Pickup": "ready_for_pickup",
    Completed: "completed",
    Cancelled: "cancelled",
  };
  res.json({ status: map[order.orderStatus] || "unknown" });
});

router.post("/api/cancel-order/:orderId", isAuthenticated, async (req, res) => {
  await orderService.cancelOrder(req.params.orderId);
  res.json({ success: true });
});

router.post("/api/pickup-order/:orderId", isAuthenticated, async (req, res) => {
  await orderService.completeOrder(req.params.orderId);
  res.json({ success: true });
});

router.get("/order-history", isAuthenticated, async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.user.UserID);
  const allOrders = await orderService.getOrdersByCustomerId(
    customer.customerId,
  );
  const orders = allOrders.filter(
    (o) => o.OrderStatus === "Completed" || o.OrderStatus === "Cancelled",
  );
  res.render("partials/order-history", { user: req.user, orders });
});

router.get("/reviews", isAuthenticated, async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.user.UserID);
  const reviews = customer
    ? await reviewService.getReviewsByCustomerId(customer.customerId)
    : [];
  res.render("partials/customer-reviews", { user: req.user, reviews });
});

router.get("/cart", isAuthenticated, (req, res) => {
  res.render("customers/cart", { user: req.user });
});

router.get("/checkout", isAuthenticated, (req, res) => {
  res.render("customers/checkout", { user: req.user });
});

router.get('/browse', isAuthenticated, async (req, res) => {
    const q = (req.query.q || '').trim();
    const merchants = q
        ? await merchantService.searchMerchants(q)
        : await merchantService.getAllMerchantsWithStats();
    res.render('customers/browse', { user: req.user, merchants, q });
});

router.get("/merchant/:merchantId", isAuthenticated, async (req, res) => {
  const merchantId = req.params.merchantId;
  const merchant = await merchantService.getMerchantByID(merchantId);
  const menuItems = await merchantService.getMenu(merchantId);
  const reviews = await merchantService.getReviews(merchantId);

  res.render("customers/restaurant-detail", {
    user: req.user,
    merchant,
    menuItems: merchant.menuItems.filter((i) => i.available),
    reviews,
  });
});

router.get("/restaurant-detail", isAuthenticated, async (req, res) => {
  const merchants = await merchantService.getAllMerchantsWithStats();
  res.render("customers/browse", { user: req.user, merchants });
});

router.post("/checkout", isAuthenticated, async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.user.UserID);
  const { merchantId, items } = req.body;
  const merchant = await merchantService.getMerchantByID(merchantId);

  const orderItems = items.map((i) => ({
    itemId: Number(i.itemId),
    name: i.name,
    priceAtPurchase: i.price,
    quantity: i.quantity,
  }));

  console.log(orderItems);

  const newOrder = await orderService.createOrder(
    customer.customerId,
    merchantId,
    orderItems,
  );

  console.log("New Order", newOrder);

  const orderCheck = await orderService.getOrdersByCustomerId(
    customer.customerId,
  );
  console.log(orderCheck);

  res.json({ success: true, order: newOrder, merchant });
});

router.get("/order-confirmation", isAuthenticated, async (req, res) => {
  const orderId = req.query.orderId;
  if (!orderId) return res.redirect("/customer/browse");

  const order = await orderService.getOrderById(orderId);
  if (!order) return res.redirect("/customer/browse");

  const merchant = await merchantService.getMerchantByID(order.merchantId);

  res.render("customers/order-confirmation", {
    user: req.user,
    order,
    merchant,
  });
});

router.post("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const { firstName, lastName, address } = req.body;
    const customer = await customerService.getCustomerByUserId(req.user.UserID);
    if (!customer) return res.status(400).json({ error: "Customer not found" });
    await customerService.updateProfile(req.user.UserID, customer.customerId, {
      firstName,
      lastName,
      address,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;
