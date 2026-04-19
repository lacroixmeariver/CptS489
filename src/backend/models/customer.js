class Customer
{
    constructor(customerId, address)
    {
        this.customerId = customerId;
        this.address = address;
    }

    updateProfile({address})
    {
        if (address !== undefined)
        {
            if (name.trim().length ===0)
            {
                throw new Error("Name cannot be empty");
            }
            this.address = address;
        }
        
    }
}
module.exports = Customer;