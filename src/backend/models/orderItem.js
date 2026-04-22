class OrderItem {
  constructor(orderItemId, itemId, name, priceAtPurchase, quantity) {
    this.orderItemId = orderItemId;
    this.itemId = itemId;
    this.name = name;
    this.priceAtPurchase = priceAtPurchase;
    this.quantity = quantity;
  }

  increaseQuantity(amount = 1) {
    this.quantity += amount;
  }

  decreaseQuantity(amount = 1) {
    if (this.quantity - amount < 0) {
      throw new Error("Quantity cannot be negative.");
    }

    this.quantity -= amount;

    return this.quantity === 0;
  }
}

module.exports = OrderItem;
