class MenuItem
{
    /// <summary>
    /// instantiates a menu item with details such as the item's unique identifier, name, description, price, and category.
    /// </summary>
    constructor(itemId, name, calories, price, description=null, recipe=null)
    {
        this.itemId = itemId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.calories = calories;
        this.recipe = recipe;
    }

    UpdateDatabase()
    {
        // will need to update database to reflect changes to menu item details
    }
}

module.exports = MenuItem;