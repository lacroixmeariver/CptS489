class Order
{
    /// <summary>
    /// instantiates a customer's order, including details such as the customer, merchant, order status, timestamps, total amount, and the items in the order.
    /// </summary>
    constructor(orderId, customerId, merchantId, orderStatus, timeOrdered, timeCompleted=null, totalAmount, orderItems)
    {
        this.orderId = orderId;
        this.customerId = customerId;
        this.merchantId = merchantId;
        this.orderStatus = orderStatus;
        this.timeOrdered = timeOrdered;
        this.timeCompleted = timeCompleted;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
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
        this.totalAmount = this.orderItems.reduce((total, item) => total + (item.priceAtPurchase * item.quantity), 0);
    }

    /// <summary>
    /// checks if the order has been finalized, meaning it is either completed or canceled, which can be used to prevent further modifications to the order.
    /// </summary>
    isFinalized()
    {
        return this.orderStatus === "completed" || this.orderStatus === "canceled";
    }

}