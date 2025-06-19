const { Description } = require("../models/Models");

const insert = async (data) => {
  const desc = new Description(data);
  return await desc.save();
};

const update = async (data) => {
  const { _id, ...fields } = data;
  return await Description.findByIdAndUpdate(_id, fields, { new: true });
};

const deleteById = async (id) => {
  return await Description.findByIdAndDelete(id);
};

const findByProductId = async (productId, multiple = false) => {
  if (multiple) {
    return await Description.find({ productId }); // Trả về mảng nếu multiple là true
  }
  return await Description.findOne({ productId }); // Trả về một bản ghi nếu multiple là false
};

const selectByID = async (id) => {
  return await Description.findById(id); // Thêm hàm selectByID để tìm theo _id
};

module.exports = {
  insert,
  update,
  delete: deleteById,
  findByProductId,
  selectByID,
};
