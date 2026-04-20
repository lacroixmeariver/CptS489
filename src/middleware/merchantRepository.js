const Merchant = require("../backend/models/merchant");
const MenuItem = require("../backend/models/menuItem");

class MerchantRepository
{
    constructor(dbPromise)
    {
        this.dbPromise = dbPromise;
    }

    async save(merchant, userId)
    {
        const db = await this.dbPromise;
        const result = await db.run(`INSERT INTO Merchants (UserID, MerchantName, MerchantAddress, Verified, StoreScore, Status) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                merchant.name,
                merchant.address,
                merchant.verified,
                merchant.storeScore,
                merchant.status
            ]
        );
        
        const merchantId = result.lastID;

        for (const item of merchant.menuItems)
        {
            await db.run('INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Recipe, Available) VALUES(?, ?, ?, ?, ?, ?, ?)',
                [
                    merchantId,
                    item.name,
                    item.calories,
                    item.price,
                    item.description,
                    item.recipe,
                    item.available
                ]
            );
        }

        return merchantId;
    }

    async update(merchant)
    {
        const db = await this.dbPromise;
        await db.run(
            `UPDATE Merchants
            SET MerchantName  = ?,
                MerchantAddress = ?,
                Verified= ?,
                StoreScore = ?,
                Status = ?,
                Bio = ?
            WHERE MerchantID = ?`,
            [
                merchant.name,
                merchant.address,
                merchant.verified,
                merchant.storeScore,
                merchant.status,
                merchant.bio,
                merchant.merchantId
            ]
        );

        for (const item of merchant.menuItems)
        {
            if (item.itemId) {
                await db.run(
                    `UPDATE MenuItems SET ItemName=?, Calories=?, Price=?, Description=?, Recipe=?, Available=? WHERE ItemID=?`,
                    [item.name, item.calories, item.price, item.description, item.recipe, item.available, item.itemId]
                );
            } else {
                await db.run(
                    `INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Recipe, Available) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [merchant.merchantId, item.name, item.calories, item.price, item.description, item.recipe, item.available]
                );
            }
        }
    }

    async getById(merchantId)
    {
        const db = await this.dbPromise;
        const merchantRow = await db.get(
                    `SELECT * FROM Merchants WHERE MerchantID = ?`,
                    [merchantId]
                );
        
                if (!merchantRow) return null;
        
                const itemRows = await db.all(
                    `SELECT * FROM MenuItems WHERE MerchantID = ?`,
                    [merchantId]
                );
        
                const items = itemRows.map(row =>
                    new MenuItem(row.ItemID, row.ItemName, row.Calories, row.Price, row.Description, row.Recipe, row.Available)
                );
        
        return new Merchant(
                    merchantRow.MerchantID,
                    merchantRow.MerchantName,
                    merchantRow.MerchantAddress,
                    merchantRow.Verified,
                    merchantRow.StoreScore,
                    items,
                    merchantRow.Status,
                    merchantRow.Bio
                );
    }

    async getByUserId(userID)
    {
        const db = await this.dbPromise;
        const merchantRow = await db.get(
                    `SELECT * FROM Merchants WHERE UserID = ?`,
                    [userID]
                );

                if (!merchantRow) return null;

        
                const itemRows = await db.all(
                    `SELECT * FROM MenuItems WHERE MerchantID = ?`,
                    [merchantRow.MerchantID]
                );

                const items = itemRows.map(row =>
                    new MenuItem(row.ItemID, row.ItemName, row.Calories, row.Price, row.Description, row.Recipe, row.Available)
                );
        
                return new Merchant(
                    merchantRow.MerchantID,
                    merchantRow.MerchantName,
                    merchantRow.MerchantAddress,
                    merchantRow.Verified,
                    merchantRow.StoreScore,
                    items,
                    merchantRow.Status,
                    merchantRow.Bio
                );
    }


    async deleteMenuItem(itemId)
    {
        const db = await this.dbPromise;
        await db.run(
            `DELETE FROM MenuItems Where ItemID = ?`,
            [itemId]
        )
    }

    async updateItems(merchantID, itemId, updatedFields)
    {
        const db = await this.dbPromise;
        await db.run(
            `UPDATE MenuItems
            SET ItemName = ?,
                Calories = ?,
                Price = ?,
                Description = ?,
                Recipe = ?,
                Available = ?
            WHERE MerchantID = ? AND ItemID = ?`,
            [
                updatedFields.name,
                updatedFields.calories,
                updatedFields.price,
                updatedFields.description,
                updatedFields.recipe,
                updatedFields.available,
                merchantID,
                itemId
            ]
        );
    }

    async getAllWithStats()
    {
        const db = await this.dbPromise;
        const merchantRows = await db.all(
            `SELECT
                m.MerchantID,
                m.MerchantName,
                m.MerchantAddress,
                m.StoreScore,
                ROUND(AVG(mi.Price), 2) AS AvgPrice,
                COUNT(DISTINCT r.ReviewID) AS ReviewCount,
                COUNT(DISTINCT o.OrderID) AS OrderCount
            FROM Merchants m
            JOIN MenuItems mi ON m.MerchantID = mi.MerchantID
            LEFT JOIN Reviews r ON m.MerchantID = r.MerchantID
            LEFT JOIN Orders o ON m.MerchantID = o.MerchantID
            WHERE m.Status = 'open'
            GROUP BY m.MerchantID`);
        return merchantRows;
    }

    async updateProfile(userId, merchantId, { firstName, lastName, address, bio, storeName })
    {
        const db = await this.dbPromise;
        if (firstName !== undefined || lastName !== undefined) {
            await db.run(
                `UPDATE Users SET First_name = ?, Last_name = ? WHERE UserID = ?`,
                [firstName, lastName, userId]
            );
        }
        if (storeName !== undefined) {
            await db.run(
                `UPDATE Merchants SET MerchantName = ? WHERE MerchantID = ?`,
                [storeName, merchantId]
            );
        }
        if (address !== undefined) {
            await db.run(
                `UPDATE Merchants SET MerchantAddress = ? WHERE MerchantID = ?`,
                [address, merchantId]
            );
        }
        if (bio !== undefined) {
            await db.run(
                `UPDATE Merchants SET Bio = ? WHERE MerchantID = ?`,
                [bio, merchantId]
            );
        }
    }

    async getReviews(merchantId)
    {
        const db = await this.dbPromise;
        const reviewRows = await db.all(
            `SELECT ReviewID, CustomerID, Rating, Comment, ReviewDate FROM Reviews WHERE MerchantID = ?`,
            [merchantId]
        );
        return reviewRows;
    }

}

module.exports = MerchantRepository;