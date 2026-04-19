const { openDelimiter } = require("ejs");
const OrderRepository = require("../middleware/orderRepository")

class OrderService
{
    constructor(orderRepository)
    {
        this.orderRepository = orderRepository;
    }

    async createOrder(customerId, merchantId, orderItems)
    {
        const order = new Order(null, customerId, merchantId, "pending", new Date(), null, orderItems);

        order.calculateTotalAmount();

        const orderID = await this.orderRepository.save(order);
        order.orderID = orderID

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
        order.updateOrderStatus("canceled");
        await this.orderRepository.update(order);
    }

    async completeOrder(orderID)
    {
        const order = await this.getOrderById(orderID);
        order.updateOrderStatus("completed");
        await this.orderRepository.update(order);
    }

    async getOrdersByCustomerId(customerId)
    {
        return await this.orderRepository.getByCustomerId(customerId);
    }

    async getOrdersByMerchantId(merchantId)
    {
        return await this.orderRepository.getByMerchantId(merchantId);
    }
}

module.exports = OrderService;