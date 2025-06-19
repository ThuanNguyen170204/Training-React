require("../utils/MongooseUtil");
const Models = require("./Models");

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async insert(customer) {
    const mongoose = require("mongoose");
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, {
      new: true,
    });
    return result;
  },
  async selectByUsername(username) {
    const query = { username: username };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },
  async update(id, updateData) {
    try {
      const result = await Models.Customer.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      return result;
    } catch (error) {
      console.error("Error updating customer:", error);
      return null;
    }
  },
};

module.exports = CustomerDAO;
