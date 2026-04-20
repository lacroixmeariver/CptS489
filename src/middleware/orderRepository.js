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

        const items = itemRows.map(row =>
            new OrderItem(
                row.OrderItemID,
                row.ItemID,
                row.ItemName,
                row.PriceAtPurchase,
                row.Quantity
            )
        );

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

    async getReportData(merchantId, period, type)
    {
        const db = await this.dbPromise;

        let dateFilter;
        let groupFormat;
        if (period === 'daily') {
            dateFilter = `datetime(TimeOrdered/1000, 'unixepoch') >= datetime('now', '-30 days')`;
            groupFormat = `strftime('%Y-%m-%d', TimeOrdered/1000, 'unixepoch')`;
        } else if (period === 'monthly') {
            dateFilter = `datetime(TimeOrdered/1000, 'unixepoch') >= datetime('now', '-12 months')`;
            groupFormat = `strftime('%Y-%m', TimeOrdered/1000, 'unixepoch')`;
        } else {
            dateFilter = `1=1`;
            groupFormat = `strftime('%Y', TimeOrdered/1000, 'unixepoch')`;
        }

        if (type === 'income') {
            return await db.all(
                `SELECT ${groupFormat} AS period_label,
                        COUNT(*) AS order_count,
                        ROUND(SUM(TotalAmount), 2) AS total_revenue
                 FROM Orders
                 WHERE MerchantID = ? AND OrderStatus = 'Completed' AND ${dateFilter}
                 GROUP BY period_label
                 ORDER BY period_label ASC`,
                [merchantId]
            );
        } else {
            return await db.all(
                `SELECT mi.ItemName,
                        SUM(oi.Quantity) AS total_qty,
                        ROUND(SUM(oi.PriceAtPurchase * oi.Quantity), 2) AS total_revenue
                 FROM OrderItems oi
                 JOIN Orders o ON oi.OrderID = o.OrderID
                 JOIN MenuItems mi ON oi.ItemID = mi.ItemID
                 WHERE o.MerchantID = ? AND o.OrderStatus = 'Completed' AND ${dateFilter}
                 GROUP BY mi.ItemName
                 ORDER BY total_qty DESC`,
                [merchantId]
            );
        }
    }

}

module.exports = OrderRepository;