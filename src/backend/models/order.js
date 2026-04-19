class Order
{
    /// <summary>
    /// instantiates a customer's order, including details such as the customer, merchant, order status, timestamps, total amount, and the items in the order.
    /// </summary>
    constructor(orderId=null, customerId, merchantId, orderStatus, timeOrdered, timeCompleted=null, orderItems)
    {
        this.orderId = orderId;
        this.customerId = customerId;
        this.merchantId = merchantId;
        this.orderStatus = orderStatus;
        this.timeOrdered = timeOrdered;
        this.timeCompleted = timeCompleted;
        this.orderItems = orderItems;
        this.totalAmount = this.calculateTotalAmount();
    }

    /// <summary>
    /// adds an item to the order and updates the total amount accordingly.
    /// </summary>
    addOrderItem(orderItem)
    {
        this.orderItems.push(orderItem);
        this.totalAmount += orderItem.priceAtPurchase * orderItem.quantity;
    }

    /// <summary>
    /// removes an item from the order and updates the total amount accordingly, also checks if the order is finalized before allowing modifications.
    /// </summary>
    removeOrderItem(orderItem)
    {
        if (this.orderStatus === "completed" || this.orderStatus === "canceled")
        {
            throw new Error("Cannot change status of a completed or canceled order.");
        }
        if (this.orderStatus === "pending")
        {
            this.orderItems = this.orderItems.filter(item => item.orderItemId !== orderItem.orderItemId);
            this.totalAmount = this.calculateTotalAmount();
        }

    }

    /// <summary>    
    /// updates the status of the order, allowing for changes such as from "pending" to "completed" or "canceled", also updates the completion timestamp.
    /// </summary>
    updateOrderStatus(newStatus)
    {
        if (this.orderStatus === "completed" || this.orderStatus === "canceled")
        {
            throw new Error("Cannot change status of a completed or canceled order.");
        }
        this.orderStatus = newStatus;

        if (newStatus === "completed" || newStatus === "canceled")
        {
            this.timeCompleted = new Date();
        }
        
    }

    /// <summary>
    /// recalculates the total amount of the order based on the current items and their prices, useful if items are added, removed, or updated after the initial calculation.
    /// </summary>
    calculateTotalAmount()
    {
        this.totalAmount = 0;
        for (const element of this.orderItems)
        {
            this.totalAmount += element.priceAtPurchase * element.quantity;
        }
        return this.totalAmount;
    }

    /// <summary>
    /// checks if the order has been finalized, meaning it is either completed or canceled, which can be used to prevent further modifications to the order.
    /// </summary>
    isFinalized()
    {
        return this.orderStatus === "completed" || this.orderStatus === "canceled";
    }

    /// <summary>
    /// updates the quantity of a specific item in the order, allowing for adjustments to the order after items have been added, also checks if the order is finalized before allowing modifications.
    /// </summary>
    updateItemQuantity(orderItemId, newQuantity)
    {
        if (this.isFinalized())
        {
            throw new Error("Cannot change status of a completed or canceled order.");
        }

        const item = this.orderItems.find(item => item.orderItemId === orderItemId);
        if (!item)
        {
            throw new Error("Order item not found.");
        }

        const shouldRemove = item.decreaseQuantity(item.quantity - newQuantity);
        if (shouldRemove)        
        {
            this.removeOrderItem(item);
        }
        else
        {
            this.calculateTotalAmount();
        }
    }
}

module.exports = Order;