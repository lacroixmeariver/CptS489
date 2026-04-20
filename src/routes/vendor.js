var express = require('express');
var router = express.Router();
const { isAuthenticated } = require('../middleware/isAuth');
const { dbPromise, db} = require('../config/db');
const MerchantRepository = require("../middleware/merchantRepository");
const MerchantService = require("../services/merhcantService");
const OrderService = require("../services/orderService");
const OrderRepository = require("../middleware/orderRepository");

const merchantRepo = new MerchantRepository(dbPromise);
const merchantService = new MerchantService(merchantRepo);
const orderRepo = new OrderRepository(dbPromise);
const orderService = new OrderService(orderRepo);

// gets the vendor dashboard page
router.get('/dashboard', isAuthenticated, async (req, res) => {
    console.log('User in dashboard:', req.user);
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    res.render('vendor/merchant-dashboard', { user: req.user, merchant: merchant });
});

router.get('/open-store', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    await merchantService.openStore(merchant.merchantId);
    console.log('store open');
    res.redirect('/vendor/live-operations');
});

router.get('/close-store', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    await orderService.cancelPendingOrdersForMerchant(merchant.merchantId);
    await merchantService.closeStore(merchant.merchantId);
    console.log('store closed');
    res.redirect('/vendor/dashboard');
});


router.post('/accept-order/:orderId', isAuthenticated, async (req, res) => {
    const orderId = req.params.orderId;
    await orderService.updateOrderStatus(orderId, 'Accepted');
    res.json({ success: true });
});

router.post('/confirm-order/:orderId', isAuthenticated, async (req, res) => {
    const orderId = req.params.orderId;
    await orderService.updateOrderStatus(orderId, 'Ready For Pickup');
    res.json({ success: true });
});

router.post('/cancel-order/:orderId', isAuthenticated, async (req, res) => {
    const orderId = req.params.orderId;

    await orderService.cancelOrder(orderId);

    res.json({ success: true });
});

router.get("/api/pending-orders", isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const pendingOrders = await orderService.getPendingOrdersForMerchant(merchant.merchantId);
    console.log(pendingOrders);
    res.json(pendingOrders);
});

router.get("/api/current-orders", isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const currentOrders = await orderService.getCurrentOrdersForMerchant(merchant.merchantId);
    console.log(currentOrders);
    res.json(currentOrders);
});

router.get("/api/live-menu", isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const liveMenu = await merchantService.getMenu(merchant.merchantId);
    res.json(liveMenu);
});

router.get('/api/complete-order', isAuthenticated, async (req, res) => {
    const orderId = req.query.orderId;
    await orderService.completeOrder(orderId);
    res.json({ success: true });
});

router.get('/api/cancel-order', isAuthenticated, async (req, res) => {
    const orderId = req.query.orderId;
    await orderService.cancelOrder(orderId);
    res.json({ success: true });
});

router.get('/api/confirm-order', isAuthenticated, async (req, res) => {
    const orderId = req.query.orderId;
    await orderService.confirmOrder(orderId);
    res.json({ success: true });
});

router.get('/api/toggle-menu-item', isAuthenticated, async (req, res) => {
    const itemId = req.query.itemId;
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    await merchantService.toggleMenuItemAvailability(merchant.merchantId, itemId);
    res.json({ success: true });
});

// get the live operations page 
router.get('/live-operations', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    res.render('vendor/live-operations', { user: req.user, merchant: merchant });
});

router.get('/my-menu',isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    res.render('vendor/my-menu', { user: req.user, merchant: merchant });
});

router.post('/menu/delete/:itemId', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const itemId = req.params.itemId;

    await merchantService.removeMenuItem(merchant.merchantId, itemId);
    res.redirect('/vendor/my-menu');
});

router.post('/menu/edit/:itemId', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const itemId = req.params.itemId;

    const updatedFields = {
        name: req.body.itemName,
        price: req.body.itemPrice,
        calories: req.body.itemCalories,
        description: req.body.itemDescription,
        recipe: req.body.itemRecipe,
        available: req.body.itemAvailable === 'on' ? true : false
    };

    await merchantService.editMenuItem(merchant.merchantId, itemId, updatedFields);

    res.redirect('/vendor/my-menu');
});

router.post('/menu/toggle-availability/:itemId', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const itemId = req.params.itemId;
    console.log('availability', merchant.menuItems.find(item => item.itemId === itemId).available);
    merchantService.toggleMenuItemAvailability(merchant.merchantId, itemId);
    console.log('availability', merchant.menuItems.find(item => item.itemId === itemId).available);
    res.redirect('/vendor/my-menu');
});

router.post('/menu/add', isAuthenticated, async (req, res) => {
    const merchant = await merchantService.getMerchantByUserID(req.user.UserID);
    const newItem = {
        name: req.body.itemName,
        price: req.body.itemPrice,
        description: req.body.itemDescription,
        recipe: req.body.itemRecipe,
        calories: req.body.itemCalories,
        available: true
    };

    await merchantService.addMenuItem(merchant.merchantId, newItem);
    res.redirect('/vendor/my-menu');
});


module.exports = router;