const { HotProduct, Product } = require("./Models");
const mongoose = require("mongoose"); // Thêm import mongoose

const HotProductDAO = {
  async getAll() {
    return HotProduct.find().lean();
  },

  async add(productData) {
    const { productId, name, image, discountedPrice } = productData;
    const exists = await HotProduct.findOne({ productId });
    if (exists) return exists;

    // Lấy giá và discount từ Product
    const product = await Product.findById(productId).lean();
    if (!product) throw new Error("Product not found");

    const hot = new HotProduct({
      _id: new mongoose.Types.ObjectId(), // Sử dụng mongoose đã import
      productId,
      name: name || product.name,
      price: product.price,
      image: image || product.image,
      discount: product.discount,
      discountedPrice: discountedPrice || product.discountedPrice,
    });
    return hot.save();
  },

  async remove(productId) {
    return HotProduct.findOneAndDelete({ _id: productId }); // Sử dụng _id thay vì productId nếu cần
  },
};

module.exports = HotProductDAO;
