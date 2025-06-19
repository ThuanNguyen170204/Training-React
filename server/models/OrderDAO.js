require("../utils/MongooseUtil");
const Models = require("./Models");

const OrderDAO = {
  async insert(order) {
    const mongoose = require("mongoose");
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },
  async selectByCustID(_cid) {
    const query = { "customer._id": _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },
  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
  async update(orderId, updateData) {
    const result = await Models.Order.findByIdAndUpdate(orderId, updateData, {
      new: true, // Trả về bản ghi đã cập nhật
    });
    return result;
  },
  async selectByID(orderId) {
    const order = await Models.Order.findById(orderId).exec();
    return order;
  },
};

module.exports = OrderDAO;
