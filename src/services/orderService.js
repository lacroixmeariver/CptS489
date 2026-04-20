const { openDelimiter } = require("ejs");
const Order = require("../backend/models/order")
const OrderRepository = require("../middleware/orderRepository")

class OrderService
{
    constructor(orderRepository)
    {
        this.orderRepository = orderRepository;
    }

    async createOrder(customerId, merchantId, orderItems)
    {
        const order = new Order(null, customerId, merchantId, "Pending", new Date(), null, orderItems);

        order.calculateTotalAmount();

        const orderID = await this.orderRepository.save(order);
        order.orderId = orderID

        return order;
    }

    async addOrderItem(orderID, orderItem)
    {
        const order = await this.getOrderById(orderID);
        order.addOrderItem(orderItem);
        await this.orderRepository.update(order);
    }

    async removeOrderItem(orderID, orderItem)
    {
        const order = await this.getOrderById(orderID);
        order.removeOrderItem(orderItem);
        await this.orderRepository.update(order);
    }

    async updateOrderStatus(orderID, newStatus)
    {
        const order = await this.getOrderById(orderID);
        order.updateOrderStatus(newStatus);
        await this.orderRepository.update(order);
    }

    async getOrderById(orderId)
    {
        return await this.orderRepository.getById(orderId);
    }

    async calculateTotalAmount(orderID)
    {
        const order = await this.getOrderById(orderID);
        order.calculateTotalAmount();
        await this.orderRepository.update(order);
    }

    async cancelOrder(orderID)
    {
        const order = await this.getOrderById(orderID);
        order.updateOrderStatus("Cancelled");
        await this.orderRepository.update(order);
    }

    async completeOrder(orderID)
    {
        const order = await this.getOrderById(orderID);
        order.updateOrderStatus("Completed");
        await this.orderRepository.update(order);
    }

    async getOrdersByCustomerId(customerId)
    {
        return await this.orderRepository.findByCustomerId(customerId);
    }

    async getOrdersByMerchantId(merchantId)
    {
        return await this.orderRepository.findByMerchantId(merchantId);
    }

    async getPendingOrdersForMerchant(merchantId)
    {
        return await this.orderRepository.findPendingOrdersByMerchantId(merchantId);
    }

    async cancelPendingOrdersForMerchant(merchantId)
    {
        await this.orderRepository.cancelPendingOrdersByMerchantId(merchantId);
    }

    async getCurrentOrdersForMerchant(merchantId)
    {
        return await this.orderRepository.findCurrentOrdersByMerchantId(merchantId);
    }

    async getReportData(merchantId, period, type)
    {
        return await this.orderRepository.getReportData(merchantId, period, type);
    }
}

module.exports = OrderService;