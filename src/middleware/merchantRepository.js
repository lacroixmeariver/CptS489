const Merchant = require("../backend/models/merchant");
const MenuItem = require("../backend/models/menuItem");

class MerchantRepository
{
    constructor(db)
    {
        this.db = db;
    }

    async save(merchant, userId)
    {
        const result = await this.db.run(`INSERT INTO Merchants (UserID, MerchantName, MerchantAddress, Verified, StoreScore, Open) VALUES (?, ?, ?, ?, ?, ?)`,
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
            await this.db.run('INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Recipe) VALUES(?, ?, ?, ?, ?, ?)',
                [
                    merchantId,
                    item.name,
                    item.calories,
                    item.price,
                    item.description,
                    item.recipe
                ]
            );
        }

        return merchantId;
    }

    async update(merchant)
    {
        await this.db.run(
            `UPDATE Merchants
            SET MerchantName  = ?,
                MerchantAddress = ?,
                Verified= ?,
                StoreScore = ?,
                Open = ?
            WHERE MerchantID = ?`,
            [
                merchant.name,
                merchant.address,
                merchant.verified,
                merchant.storeScore,
                merchant.status,
                merchant.merchantId
            ]
        );

        await this.db.run(
            `DELETE FROM MenuItems WHERE MerchantID = ?`,
            [merchant.merchantId]
        );

        for (const item of merchant.menuItems)
        {
            await this.db.run(
                `INSERT INTO MenuItems (MerchantID, ItemName, Calories, Price, Description, Recipe)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    merchant.merchantId,
                    item.name,
                    item.calories,
                    item.price,
                    item.description,
                    item.recipe
                ]
            );
        }
    }

    async getById(merchantId)
    {
        const merchantRow = await this.db.get(
                    `SELECT * FROM Merchants WHERE MerchantID = ?`,
                    [merchantId]
                );
        
                if (!merchantRow) return null;
        
                const itemRows = await this.db.all(
                    `SELECT * FROM MenuItems WHERE MerchantID = ?`,
                    [merchantId]
                );
        
                const items = itemRows.map(row =>
                    new MenuItem(row.ItemID, row.ItemName, row.Calories, row.Price, row.Description, row.Recipe)
                );
        
                return new Merchant(
                    merchantId,
                    merchantRow.MerchantName,
                    merchantRow.MerchantAddress,
                    merchantRow.Verified,
                    merchantRow.StoreScore,
                    items,
                    merchantRow.Open
                );
    }

    async getByUserId(userID)
    {
        const merchantRow = await this.db.get(
                    `SELECT * FROM Merchants WHERE UserId = ?`,
                    [userID]
                );
        
                if (!merchantRow) return null;
        
                const itemRows = await this.db.all(
                    `SELECT * FROM MenuItems WHERE MerchantID = ?`,
                    [merchantRow.MerchantID]
                );
        
                const items = itemRows.map(row =>
                    new MenuItem(row.ItemID, row.ItemName, row.Calories, row.Price, row.Description, row.Recipe)
                );
        
                return new Merchant(
                    merchantRow.MerchantID,
                    merchantRow.MerchantName,
                    merchantRow.MerchantAddress,
                    merchantRow.Verified,
                    merchantRow.StoreScore,
                    items,
                    merchantRow.Open
                );
    }


    async deleteMenuItem(itemId)
    {
        await this.db.run(
            `DELETE FROM MenuItems Where ItemID = ?`,
            [itemId]
        )
    }
}