const mongoose = require("mongoose");

// Admin
const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);

// Category
const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    icon: { type: String, required: false }, // Class Font Awesome
    image: { type: String, required: false }, // Ảnh base64 hoặc URL
  },
  { versionKey: false }
);

// Customer
const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    email: String,
    phone: String,
    active: Number,
    token: String,
  },
  { versionKey: false }
);

// Product
const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    description: String,
    image: String,
    cdate: Number,
    category: CategorySchema,
    discount: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 },
  },
  { versionKey: false }
);

// ✅ Item (dùng bản rút gọn product)
const ItemSchema = mongoose.Schema(
  {
    product: {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      discount: Number,
      discountedPrice: Number,
      image: String,
    },
    quantity: Number,
  },
  { versionKey: false, _id: false }
);

// Order
const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: { type: String, required: true },
    customer: CustomerSchema,
    receiver: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: [ItemSchema],
  },
  { versionKey: false }
);

// Description
const DescriptionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    content: String,
    highlight: String,
    screensize: String,
    chip: String,
    pin: String,
    screen_technology: String,
    rear_camera: String,
    front_camera: String,
    internal_memory: String,
    sim_card: String,
    operating_system: String,
    screen_resolution: String,
    cpu: String,
    compatible: String,
  },
  { versionKey: false }
);

// HotProduct
const HotProductSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    discount: { type: Number, default: 0 },
    discountedPrice: { type: Number },
  },
  { timestamps: true }
);

// Models
const HotProduct = mongoose.model("HotProduct", HotProductSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Category = mongoose.model("Category", CategorySchema);
const Customer = mongoose.model("Customer", CustomerSchema);
const Product = mongoose.model("Product", ProductSchema);
const Order = mongoose.model("Order", OrderSchema);
const Description = mongoose.model("Description", DescriptionSchema);

module.exports = {
  Admin,
  Category,
  Customer,
  Product,
  Order,
  Description,
  HotProduct,
};
