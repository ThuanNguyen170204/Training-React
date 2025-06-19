const express = require("express");
const router = express.Router();
//utils
const JwtUtil = require("../utils/JwtUtil");
const EmailUtil = require("../utils/EmailUtil");
//daos
const AdminDAO = require("../utils/AdminDAO");
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const OrderDAO = require("../models/OrderDAO");
const CustomerDAO = require("../models/CustomerDAO");
const DescriptionDAO = require("../models/DescriptionDao");
const { Description } = require("../models/Models");
const HotProductDAO = require("../models/HotProductDAO");
const mongoose = require("mongoose");

// category
router.get("/categories", JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post("/categories", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const icon = req.body.icon; // Thêm trường icon
  const category = { name: name, icon: icon }; // Cập nhật để bao gồm icon
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const icon = req.body.icon; // Sửa lỗi từ "boyy" thành "body"
  const image = req.body.image; // Ảnh dạng base64 hoặc URL
  const category = { _id: _id, name: name, icon: icon, image: image }; // Cập nhật để bao gồm icon
  const result = await CategoryDAO.update(category);
  res.json(result);
});

router.delete("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// product
router.get("/products", JwtUtil.checkToken, async function (req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const categoryId = req.query.categoryId;
    const sortOrder = req.query.sortOrder;
    const search = req.query.search || req.query.filter?.toLowerCase() || ""; // Hỗ trợ cả search và filter
    const sizePage = 10;

    let products;
    if (categoryId) {
      products = await ProductDAO.selectByCatID(categoryId);
    } else {
      products = await ProductDAO.selectAll();
    }

    // Lọc dựa trên search hoặc filter
    if (search) {
      products = products.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const price = item.price?.toString().toLowerCase() || "";
        const cdate = new Date(item.cdate).toLocaleString().toLowerCase();
        const categoryName = item.category?.name?.toLowerCase() || "";
        const id = item._id?.toString().toLowerCase() || "";
        return (
          name.includes(search) ||
          price.includes(search) ||
          cdate.includes(search) ||
          categoryName.includes(search) ||
          id.includes(search)
        );
      });
    }

    // Sắp xếp
    if (sortOrder === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "name_asc") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "name_desc") {
      products.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Phân trang
    const noPages = Math.ceil(products.length / sizePage);
    const curPage = page;
    const offset = (curPage - 1) * sizePage;
    const paginatedProducts = products.slice(offset, offset + sizePage);

    res.json({
      products: paginatedProducts,
      noPages,
      curPage,
    });
  } catch (error) {
    console.error("GET /products error:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

// Thêm endpoint lấy sản phẩm theo ID
router.get("/products/:id", JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    if (product) {
      res.json({
        success: true,
        product: product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm!",
      });
    }
  } catch (error) {
    console.error("GET /products/:id error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
});

router.post("/products", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const discount = req.body.discount;
  const discountedPrice = req.body.discountedPrice;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    name: name,
    price: price,
    discount: discount,
    discountedPrice: discountedPrice,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const discount = req.body.discount;
  const discountedPrice = req.body.discountedPrice;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = {
    _id: _id,
    name: name,
    price: price,
    discount: discount,
    discountedPrice: discountedPrice,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// <<< BẮT ĐẦU CÁC API CHO DESCRIPTION >>>

// POST - Tạo mới mô tả sản phẩm
router.post("/product-descriptions", JwtUtil.checkToken, async (req, res) => {
  try {
    const existing = await Description.findOne({
      productId: req.body.productId,
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Mô tả đã tồn tại, hãy dùng PUT để cập nhật.",
      });
    }

    const description = new Description({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });

    const result = await description.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Tạo mô tả thành công",
        description: result,
      });
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

// PUT
router.put(
  "/product-descriptions/:id",
  JwtUtil.checkToken,
  async (req, res) => {
    try {
      const result = await Description.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (result) {
        res.json({
          success: true,
          message: "Cập nhật thành công",
          description: result,
        });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Không tìm thấy mô tả" });
      }
    } catch (err) {
      console.error("PUT error:", err);
      res.status(500).json({ success: false, message: "Lỗi server." });
    }
  }
);

// GET
router.get(
  "/product-descriptions/:productId",
  JwtUtil.checkToken,
  async (req, res) => {
    try {
      const description = await Description.findOne({
        productId: req.params.productId,
      });
      if (!description) {
        return res.status(404).json(null);
      }
      res.json(description);
    } catch (err) {
      console.error("GET error:", err);
      res.status(500).json({ success: false, message: "Lỗi server." });
    }
  }
);

// DELETE - Xoá mô tả
router.delete(
  "/product-descriptions/:id",
  JwtUtil.checkToken,
  async (req, res) => {
    try {
      const result = await DescriptionDAO.delete(req.params.id);
      if (result) {
        res.json({ success: true, message: "Đã xoá mô tả thành công." });
      } else {
        res.status(404).json({
          success: false,
          message: "Không tìm thấy mô tả để xoá.",
        });
      }
    } catch (error) {
      console.error("DELETE error:", error);
      res.status(500).json({ success: false, message: "Lỗi server." });
    }
  }
);

// <<< KẾT THÚC CÁC API CHO DESCRIPTION >>>

// login
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password
    );
    if (admin) {
      const token = JwtUtil.genToken();
      res.json({
        success: true,
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});
// order
router.get("/orders", JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
router.put("/orders/status/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});
router.get(
  "/orders/customer/:cid",
  JwtUtil.checkToken,
  async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  }
);
// customer
router.get("/customers", JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
router.put(
  "/customers/deactive/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 0);
    res.json(result);
  }
);
router.get(
  "/customers/sendmail/:id",
  JwtUtil.checkToken,
  async function (req, res) {
    const _id = req.params.id;
    const cust = await CustomerDAO.selectByID(_id);
    if (cust) {
      const send = await EmailUtil.send(cust.email, cust._id, cust.token);
      if (send) {
        res.json({ success: true, message: "Please check email" });
      } else {
        res.json({ success: false, message: "Email failure" });
      }
    } else {
      res.json({ success: false, message: "Not exists customer" });
    }
  }
);

// Lấy danh sách sản phẩm hot
router.get("/hot-products", JwtUtil.checkToken, async (req, res) => {
  try {
    const hotProducts = await HotProductDAO.getAll();
    res.json(hotProducts);
  } catch (error) {
    console.error("GET /hot-products error:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

// Thêm sản phẩm hot
router.post("/hot-products", JwtUtil.checkToken, async (req, res) => {
  try {
    const { productId, name, image, discountedPrice } = req.body;
    if (!productId)
      return res.status(400).json({ error: "productId is required" });

    const result = await HotProductDAO.add({
      productId,
      name,
      image,
      discountedPrice,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("POST /hot-products error:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

// Xoá sản phẩm khỏi danh sách hot
router.delete("/hot-products/:id", JwtUtil.checkToken, async (req, res) => {
  try {
    const result = await HotProductDAO.remove(req.params.id);
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("DELETE /hot-products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Xác nhận đơn hàng
router.put("/orders/:id/confirm", JwtUtil.checkToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrder = await OrderDAO.update(orderId, { status: "APPROVED" }); // Chỉ cần truyền một đối tượng với trường status
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ success: false, message: "Order not found." });
    }
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
});

module.exports = router;
