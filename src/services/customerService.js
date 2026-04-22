const { openDelimiter } = require("ejs");
const OrderService = require("../services/orderService");
const CustomerRepository = require("../middleware/customerRepository");
const db = require("../config/db");

class CustomerService {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async getCustomerById(customerId) {
    return await this.customerRepository.getById(customerId);
  }

  async getCustomerByUserId(userId) {
    const customer = await this.customerRepository.getByUserId(userId);

    return customer;
  }

  async updateCustoemerProfile(customerId, fields) {
    const customer = await this.customerRepository.getById(customerId);
    customer.updateProfile(fields);
    await this.customerRepository.update(customer);
    return customer;
  }

  async updateProfile(userId, customerId, fields) {
    return await this.customerRepository.updateProfile(
      userId,
      customerId,
      fields,
    );
  }
}

module.exports = CustomerService;
