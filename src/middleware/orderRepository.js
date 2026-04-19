const Order = require("/src/backend/models/order");
const OrderItem = require("/src/backend/models/orderItem");

class OrderRepository
{
    constructor(db)
    {
        this.db = db;
    }

    async save(order)
    {
        const result = await this.db.run(`INSERT INTO Orders (CustomerID, MerchantID, OrderStatus, TimeOrdered, TimeCompleted, TotalAmount) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                order.customerId,
                order.merchantId,
                order.status,
                order.timeOrdered,
                order.timeCompleted,
                order.totalAmount
            ]
        );
        
        const orderId = result.lastID;

        for (const item of order.orderItems)
        {
            await this.db.run('INSERT INTO OrderItems (OrderID, Name, Price, Quantity) VALUES(?, ?, ?, ?)',
                [
                    orderId,
                    item.name,
                    item.price,
                    item.quantity
                ]
            );
        }

        return orderId;
    }

    async update(order)
    {
        await this.db.run(
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
                order.status,
                order.timeOrdered,
                order.timeCompleted,
                order.totalAmount,
                order.orderId
            ]
        );

        await this.db.run(
            `DELETE FROM OrderItems WHERE OrderID = ?`,
            [order.orderId]
        );

        for (const item of order.orderItems)
        {
            await this.db.run(
                `INSERT INTO OrderItems (OrderID, Name, Price, Quantity)
                VALUES (?, ?, ?, ?)`,
                [
                    order.orderId,
                    item.name,
                    item.price,
                    item.quantity
                ]
            );
        }
    }

    async getById(orderId)
    {
        await this.db.get(
            `SELECT * FROM Orders WHERE OrderId = ?`,
            [orderId]
        );

        if (!orderRow) return null;

        const itemRows = await this.db.all(
            `SELECT * FROM OrderItems WHERE OrderID = ?`,
            [orderId]
        );

        const items = itemRows.map(row =>
            new OrderItem(row.ItemID, row.Name, row.Price, row. Quantity)
        );

        return new Order(
            orderRow.OrderID,
            orderRow.CustomerID,
            oderRow.MechantID,
            orderRow.OrderStatus,
            orderRow.TimeOrdered,
            orderRow.TimeCompleted,
            orderRow.TotalAmount,
            items
        );
    }

    async findByCustomerId(customerId)
    {
        return await this.db.all(
            `SELECT * FROM Orders WHERE CustomerId = ?`,
            [customerId]
        );
    }

    async findByMerchantId(merchantId)
    {
        return await this.db.all(
            `SELECT * FROM Orders WHERE MerchantID = ?`,
            [merchantId]
        );
    }
}