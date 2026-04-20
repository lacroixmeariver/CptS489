const Order = require("../backend/models/order");
const OrderItem = require("../backend/models/orderItem");

class OrderRepository
{
    constructor(dbPromise)
    {
        this.dbPromise = dbPromise;
    }

    async save(order)
    {
        const total = order.calculateTotalAmount();
        const db = await this.dbPromise;
        const result = await db.run(`INSERT INTO Orders (CustomerID, MerchantID, OrderStatus, TimeOrdered, TimeCompleted, TotalAmount) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                order.customerId,
                order.merchantId,
                order.orderStatus,
                order.timeOrdered,
                order.timeCompleted,
                total
            ]
        );
        
        const orderId = result.lastID;

        for (const item of order.orderItems)
        {
            console.log("Items", item);
            await db.run('INSERT INTO OrderItems (OrderID, ItemID, PriceAtPurchase, Quantity) VALUES(?, ?, ?, ?)',
                [
                    orderId,
                    item.itemId,
                    item.priceAtPurchase,
                    item.quantity
                ]
            );
        }

        return orderId;
    }

    async update(order)
    {
        const db = await this.dbPromise;
        await db.run(
            `UPDATE Orders
            SET CustomerID = ?,
                MerchantID = ?,
                OrderStatus= ?,
                TimeOrdered = ?,
                TimeCompleted = ?,
                TotalAmount = ?
            WHERE OrderID = ?`,
            [
                order.customerId,
                order.merchantId,
                order.orderStatus,
                order.timeOrdered,
                order.timeCompleted,
                order.totalAmount,
                order.orderId
            ]
        );

        await db.run(
            `DELETE FROM OrderItems WHERE OrderID = ?`,
            [order.orderId]
        );

        for (const item of order.orderItems)
        {
            await db.run(
                `INSERT INTO OrderItems (OrderID, ItemID, PriceAtPurchase, Quantity)
                VALUES (?, ?, ?, ?)`,
                [
                    order.orderId,
                    item.itemId,
                    item.priceAtPurchase,
                    item.quantity
                ]
            );
        }
    }

   async getById(orderId)
    {
        const db = await this.dbPromise;

        const orderRow = await db.get(
            `SELECT o.*, u.First_name || ' ' || u.Last_name AS CustomerName
            FROM Orders o
            LEFT JOIN Customers c ON o.CustomerID = c.CustomerID
            LEFT JOIN Users u ON c.UserID = u.UserID
            WHERE o.OrderID = ?`,
            [orderId]
        );

        if (!orderRow) return null;

        const itemRows = await db.all(
            `SELECT oi.OrderItemID, oi.ItemID, oi.PriceAtPurchase, oi.Quantity,
                    mi.ItemName
            FROM OrderItems oi
            LEFT JOIN MenuItems mi ON oi.ItemID = mi.ItemID
            WHERE oi.OrderID = ?`,
            [orderId]
        );

        console.log(itemRows);

        const items = itemRows.map(row =>
            new OrderItem(
                row.OrderItemID,
                row.ItemID,
                row.ItemName,
                row.PriceAtPurchase,
                row.Quantity
            )
        );

        console.log("Items", items);

        const newOrder = new Order(
            orderRow.OrderID,
            orderRow.CustomerID,
            orderRow.MerchantID,
            orderRow.OrderStatus,
            orderRow.TimeOrdered,
            orderRow.TimeCompleted,
            items
        );

        newOrder.customerName = orderRow.CustomerName || null;
        console.log("NewOrder", newOrder);
        return newOrder;
    }

    async findByCustomerId(customerId)
    {
        const db = await this.dbPromise;
        return await db.all(
            `SELECT o.*, m.MerchantName
             FROM Orders o
             LEFT JOIN Merchants m ON o.MerchantID = m.MerchantID
             WHERE o.CustomerID = ?
             ORDER BY o.OrderID DESC`,
            [customerId]
        );
    }

    async findByMerchantId(merchantId)
    {
        const db = await this.dbPromise;
        return await db.all(
            `SELECT * FROM Orders WHERE MerchantID = ?`,
            [merchantId]
        );
    }

    async findPendingOrdersByMerchantId(merchantId)
    {
        const db = await this.dbPromise;
        const orderList = [];
        const orders = await db.all(
            `SELECT * FROM Orders WHERE MerchantID = ? AND OrderStatus = 'Pending'`,
            [merchantId]
        );

            for (const element of orders) {
                const fullOrder = await this.getById(element.OrderID);
                console.log("FullOder", fullOrder);
                orderList.push(fullOrder);
            }

        return orderList;
    }

    async cancelPendingOrdersByMerchantId(merchantId)
    {
        const db = await this.dbPromise;
        await db.run(
            `UPDATE Orders SET OrderStatus = 'Cancelled', TimeCompleted = ? WHERE MerchantID = ? AND OrderStatus = 'Pending'`,
            [new Date().toISOString(), merchantId]
        );
    }

    async findCurrentOrdersByMerchantId(merchantId)
    {
        const db = await this.dbPromise;
        const orderList = [];
        const orders = await db.all(
            `SELECT * FROM Orders WHERE MerchantID = ? AND OrderStatus = 'Accepted'`,
            [merchantId]
        );
        for (const element of orders) {
            const fullOrder = await this.getById(element.OrderID);
            orderList.push(fullOrder);
        }
        return orderList;
    }

}

module.exports = OrderRepository;