const Customer = require("../backend/models/customer");

class CustomerRepository
{
    constructor(db)
    {
        this.db = db;
    }

    async save(customer, userId)
    {
        const result = await this.db.run(
            `INSERT INTO Customers (UserID, Address) Values(?, ?)`,
            [
                userId,
                customer.address
            ]
        )

        return result.lastID;

    }

    async update(customer)
    {
        await this.db.run(
                    `UPDATE Customers
                    SET Address = ?
                    WHERE CustomerID = ?`,
                    [
                        customer.address,
                        customer.customerId
                    ]
                );
    }

    async getById(customerId)
    {
        const customerRow = await this.db.get(
            `SELECT * FROM Customers WHERE CustomerID = ?`,
            [customerId]
        )

        return new Customer
        (
            customerId,
            customerRow.Address
        )
    }

    async getByUserId(userId)
    {
        const customerRow = await this.db.get(
            `SELECT * FROM Customers WHERE UserID = ?`,
            [userId]
        )

        if (!customerRow) return null;

        return new Customer
        (
            customerRow.CustomerID,
            customerRow.Address
        )
    }
}