const Customer = require("../backend/models/customer");

class CustomerRepository
{
    constructor(dbPromise)
    {
        this.dbPromise = dbPromise;
    }

    async save(customer, userId)
    {
        const db = await this.dbPromise;
        const result = await db.run(
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
        const db = await this.dbPromise;
        await db.run(
                    `UPDATE Customers
                    SET Address = ?
                    WHERE CustomerID = ?`,
                    [
                        customer.address,
                        customer.customerId
                    ]
                );
    }

    async updateProfile(userId, customerId, { firstName, lastName, address })
    {
        const db = await this.dbPromise;
        if (firstName !== undefined || lastName !== undefined) {
            await db.run(
                `UPDATE Users SET First_name = ?, Last_name = ? WHERE UserID = ?`,
                [firstName, lastName, userId]
            );
        }
        if (address !== undefined) {
            await db.run(
                `UPDATE Customers SET Address = ? WHERE CustomerID = ?`,
                [address, customerId]
            );
        }
    }

    async getById(customerId)
    {
        const db = await this.dbPromise;
        const customerRow = await db.get(
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
        const db = await this.dbPromise;
        const customerRow = await db.get(
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

module.exports = CustomerRepository;