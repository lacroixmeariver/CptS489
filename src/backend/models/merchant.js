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
        console.log('Adding menu item to merchant:', this.merchantId);
        this.menuItems.push(menuItem);
    }

    RemoveMenuItem(menuItemID)
    {
        this.menuItems = this.menuItems.filter(item => item.itemId !== menuItemID);
    }

    EditMenuItem(itemId, updatedFields) {
        console.log('enter mercchant function', updatedFields);
        const item = this.menuItems.find(i => i.itemId === itemId);
        if (!item) return;

        Object.assign(item, updatedFields);

        console.log(this.menuItems);
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