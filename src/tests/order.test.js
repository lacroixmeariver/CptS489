const e = require('express');
const Order = require('/src/backend/models/order');
const OrderItem = require('/src/backend/models/orderItem');

describe("Order Class", () => {

    test("adds an item and updates total", () =>
    {
        const order = new Order(1, 10, 20, "pending", new Date(), null, []);
        const orderItem = new OrderItem(5, "Burger", 8.99, 2);

        order.addOrderItem(orderItem);

        expect(order.orderItems.length).toBe(1);
        expect(order.totalAmount).toBe(17.98);
    });

    test("sets completion time when status updated to completed", () =>
    {
        const order = new Order(1, 10, 20, "pending", new Date(), null, []);

        order.updateOrderStatus("completed");

        expect(order.orderStatus).toBe("completed");
        expect(order.timeCompleted).toBeInstanceOf(Date);
    });

    test("prevents modifications to completed order", () =>
    {
        const order = new Order(1, 10, 20, "completed", new Date(), null, []);

        expect(() => order.updateOrderStatus("pending")).toThrow();
    });

    test("removes an item and updates total", () =>
    {
        const orderItem1 = new OrderItem(5, "Burger", 8.99, 2);
        const orderItem2 = new OrderItem(6, "Fries", 3.99, 1);
        const order = new Order(1, 10, 20, "pending", new Date(), null, [orderItem1, orderItem2]);

        order.removeOrderItem(orderItem1);

        expect(order.orderItems.length).toBe(1);
        expect(order.totalAmount).toBe(3.99);
    });

    test("tests calculateTotalAmount", () =>
    {
        const orderItem1 = new OrderItem(5, "Burger", 8.99, 2);
        const orderItem2 = new OrderItem(6, "Fries", 3.99, 1);
        const order = new Order(1, 10, 20, "pending", new Date(), null, [orderItem1, orderItem2]);

        expect(order.calculateTotalAmount()).toBe(21.97);
    });

});