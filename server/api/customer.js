const express = require("express");
const router = express.Router();

// Định nghĩa asyncHandler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const HotProductDAO = require("../models/HotProductDAO");

// utils
const CryptoUtil = require("../utils/CryptoUtil");
const EmailUtil = require("../utils/EmailUtil");
const JwtUtil = require("../utils/JwtUtil");

// daos
const OrderDAO = require("../models/OrderDAO");
const CustomerDAO = require("../models/CustomerDAO");
const DescriptionDAO = require("../models/DescriptionDao");

// mycart
router.post("/orders", JwtUtil.checkToken, async (req, res) => {
  try {
    const order = {
      _id: new mongoose.Types.ObjectId(),
      cdate: Date.now(),
      total: req.body.total,
      status: "PENDING",
      customer: req.body.customer, // nếu cần lưu lại thông tin đăng nhập
      receiver: {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
      },
      items: req.body.items,
    };

    const result = await OrderDAO.insert(order);
    res.json({ success: true, order: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// myorders
router.get(
  "/orders/customer/:cid",
  JwtUtil.checkToken,
  async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
  }
);
// category
router.get("/categories", async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// product

router.get("/products/hot", async function (req, res) {
  const products = await HotProductDAO.getAll();
  res.json(products);
});

router.get("/products/category/:cid", async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get("/products/:id", async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});

//customer
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập tên người dùng và mật khẩu",
        });
      }

      // Lấy thông tin khách hàng bằng tên người dùng
      const customer = await CustomerDAO.selectByUsername(username);
      if (customer) {
        // Kiểm tra trạng thái tài khoản
        if (customer.active === 1) {
          // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa
          const isMatch = await CryptoUtil.comparePassword(
            password,
            customer.password
          );
          if (isMatch) {
            const token = JwtUtil.genToken();
            return res.json({
              success: true,
              message: "Xác thực thành công",
              token,
              customer,
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Tên người dùng hoặc mật khẩu không đúng",
            });
          }
        } else {
          return res
            .status(403)
            .json({ success: false, message: "Tài khoản đã bị vô hiệu hóa" });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: "Tên người dùng hoặc mật khẩu không đúng",
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi máy chủ nội bộ" });
    }
  })
);

router.get(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    const customer = await CustomerDAO.selectByID(customerId);
    if (customer) {
      return res.json(customer);
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Khách hàng không tồn tại." });
    }
  })
);

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});

router.post("/active", async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { username, password, name, email, phone } = req.body;
    if (!username || !password || !name || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
    }

    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
    if (dbCust) {
      return res.json({
        success: false,
        message: "Tên người dùng hoặc email đã tồn tại",
      });
    }

    const hashedPassword = CryptoUtil.hashPassword(password);
    const newCust = {
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      active: 1,
      token: CryptoUtil.md5(Date.now().toString()),
    };

    const result = await CustomerDAO.insert(newCust);
    return result
      ? res.json({ success: true, message: "Đăng ký thành công!" })
      : res.json({ success: false, message: "Đăng ký thất bại!" });
  })
);
router.put(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    const { username, name, phone, email, password } = req.body;
    const id = req.params.id;

    // Kiểm tra xem người dùng có tồn tại không
    const customer = await CustomerDAO.selectByID(id);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Khách hàng không tồn tại." });
    }

    // Cập nhật thông tin
    const updatedCustomer = { username, name, phone, email };
    if (password) {
      updatedCustomer.password = CryptoUtil.hashPassword(password); // Mã hóa mật khẩu
    }

    const result = await CustomerDAO.update(id, updatedCustomer); // Cập nhật trong cơ sở dữ liệu
    res.json(result);
  })
);

// Đặt lại mật khẩu
router.put(
  "/reset-password/:id",
  asyncHandler(async (req, res) => {
    const customerId = req.params.id;
    const { newPassword } = req.body;

    try {
      // Mã hóa mật khẩu mới
      const hashedPassword = CryptoUtil.hashPassword(newPassword);

      // Cập nhật mật khẩu trong cơ sở dữ liệu
      const updatedCustomer = await CustomerDAO.update(customerId, {
        password: hashedPassword,
      });

      if (updatedCustomer) {
        return res.json({
          success: true,
          message: "Mật khẩu đã được cập nhật!",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Khách hàng không tồn tại." });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi máy chủ nội bộ." });
    }
  })
);

//show tất cả mặt hàng theo thẻ
router.get(
  "/categories-with-products",
  asyncHandler(async (req, res) => {
    try {
      const categories = await CategoryDAO.selectAll();
      const data = [];

      for (const category of categories) {
        const products = await ProductDAO.selectByCatID(category._id); // Sử dụng selectByCatID
        data.push({
          category: category,
          products: products,
        });
      }
      res.json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục và sản phẩm:", error);
      res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ." });
    }
  })
);

router.get("/product-descriptions/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const descriptions = await DescriptionDAO.findByProductId(productId);
    if (!descriptions || descriptions.length === 0) {
      return res.status(404).json({ message: "Descriptions not found" });
    }
    res.json(descriptions);
  } catch (error) {
    console.error("Error fetching descriptions:", error);
    res
      .status(500)
      .json({ message: "Error fetching descriptions", error: error.message });
  }
});
router.get("/orders/:orderId", JwtUtil.checkToken, async function (req, res) {
  try {
    const orderId = req.params.orderId;
    const order = await OrderDAO.selectByID(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
});
router.post("/checkout", JwtUtil.checkToken, async (req, res) => {
  const order = req.body;
  order.cdate = Date.now();
  order.status = "PENDING";

  try {
    const result = await OrderDAO.insert(order);
    res.json(result);
  } catch (err) {
    console.error("Checkout failed:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

module.exports = router;
