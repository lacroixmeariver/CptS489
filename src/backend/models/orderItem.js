class OrderItem
{
    constructor(OrderItemID, itemId, quantity=1, price)
    {
        this.orderItemId = OrderItemID;
        this.itemId = itemId;
        this.quantity = quantity;
        this.priceAtPurchase = price;
    }

    increaseQuantity(amount=1)
    {
        this.quantity += amount;
    }

    decreaseQuantity(amount=1)
    {
        if (this.quantity - amount < 0)
        {
            throw new Error("Quantity cannot be negative.");
        }

        this.quantity -= amount;

        return this.quantity === 0;
    }
}

module.exports = OrderItem;
