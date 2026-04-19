class Merchant
{
    /// <summary>
    /// instantiates a merchant with details such as the merchant's unique identifier, name, address, verification status, and store score.
    /// </summary>
    constructor(merchantId, name, adress, verified=false, storeScore=0, menuItems=[], status="closed")
    {
        this.merchantId = merchantId;
        this.name = name;
        this.address = adress;
        this.verified = verified;
        this.storeScore = storeScore;
        this.menuItems = menuItems;
        this.status = status;
    }

    AddMenuItem(menuItem)
    {
        this.menuItems.push(menuItem);
    }

    RemoveMenuItem(menuItem)
    {
        this.menuItems = this.menuItems.filter(item => item.itemId !== menuItem.itemId);
    }

    UpdateStatus(newStatus)
    {
        if (newStatus !== "open" && newStatus !== "closed")
        {
            throw new Error("Status must be either 'open' or 'closed'.");
        }
        this.status = newStatus;
    }

    calculateStoreScore(ratings)
    {
        let totalRating = 0;
        for (const rating of ratings)
        {
            totalRating += rating;
        }

        this.storeScore = ratings.length > 0 ? totalRating / ratings.length : 0;
        // will need to update database to reflect changes to store score
    }
}

module.exports = Merchant;