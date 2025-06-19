import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import MyContext from "../contexts/MyContext";

const ProductDetail = ({ item, onClose, updateProducts }) => {
  const context = useContext(MyContext);

  const [categories, setCategories] = useState([]);
  const [txtID, setTxtID] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtPrice, setTxtPrice] = useState("");
  const [txtDiscount, setTxtDiscount] = useState(""); // Giá trị khuyến mãi (%)
  const [txtDiscountedPrice, setTxtDiscountedPrice] = useState(""); // Giá đã khuyến mãi
  const [cmbCategory, setCmbCategory] = useState("");
  const [imgProduct, setImgProduct] = useState("");
  const [initialImageBase64, setInitialImageBase64] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" }); // State cho thông báo

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [notification]);

  useEffect(() => {
    apiGetCategories();
  }, []);

  useEffect(() => {
    if (item) {
      setTxtID(item._id || "");
      setTxtName(item.name || "");
      setTxtPrice(item.price?.toLocaleString("vi-VN") || "");
      setTxtDiscount(item.discount?.toString() || "0"); // Lấy giá trị khuyến mãi từ item
      const discountedPrice = item.discountedPrice
        ? item.discountedPrice.toLocaleString("vi-VN")
        : item.price && item.discount
        ? Math.round((item.price * (1 - item.discount / 100)) / 10) *
          (10) // Làm tròn đến hàng chục
            .toLocaleString("vi-VN")
        : item.price?.toLocaleString("vi-VN") || "";
      setTxtDiscountedPrice(discountedPrice); // Tính giá đã khuyến mãi
      setCmbCategory(item.category?._id || "");
      const base64Img = item.image ? `data:image/jpg;base64,${item.image}` : "";
      setImgProduct(base64Img);
      setInitialImageBase64(base64Img);
      setImageFile(null);
    } else {
      setTxtID("");
      setTxtName("");
      setTxtPrice("");
      setTxtDiscount("0");
      setTxtDiscountedPrice("");
      setCmbCategory(categories.length > 0 ? categories[0]._id : "");
      setImgProduct("");
      setInitialImageBase64("");
      setImageFile(null);
    }
  }, [item, categories]);

  // Tính giá đã khuyến mãi mỗi khi giá gốc hoặc giá trị khuyến mãi thay đổi
  useEffect(() => {
    const price = parseInt(txtPrice.replace(/\./g, "") || "0");
    const discount = parseFloat(txtDiscount) || 0;
    if (price && discount >= 0 && discount <= 100) {
      const discountedPrice =
        Math.round((price * (1 - discount / 100)) / 10) * 10; // Làm tròn đến hàng chục
      setTxtDiscountedPrice(discountedPrice.toLocaleString("vi-VN"));
    } else {
      setTxtDiscountedPrice(price.toLocaleString("vi-VN"));
    }
  }, [txtPrice, txtDiscount]);

  const apiGetCategories = () => {
    const config = { headers: { "x-access-token": context.token } };
    axios
      .get("/api/admin/categories", config)
      .then((res) => {
        setCategories(res.data);
        if (!item && res.data.length > 0 && !cmbCategory) {
          setCmbCategory(res.data[0]._id);
        }
      })
      .catch((err) => {
        setNotification({
          message: "Lỗi khi tải danh mục!",
          type: "error",
        });
      });
  };

  const getToken = () => localStorage.getItem("authToken") || context.token;

  const formatPrice = (value) => {
    const number = value.replace(/\D/g, "");
    return Number(number).toLocaleString("vi-VN");
  };

  const handleChangeID = (e) => setTxtID(e.target.value);
  const handleChangeName = (e) => setTxtName(e.target.value);
  const handleChangePrice = (e) => setTxtPrice(formatPrice(e.target.value));
  const handleChangeDiscount = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100)) {
      setTxtDiscount(value);
    }
  };
  const handleChangeCategory = (e) => setCmbCategory(e.target.value);

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setImgProduct(readerEvent.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImgProduct(initialImageBase64);
    }
  };

  const prepareImageBase64 = () => {
    return imgProduct.startsWith("data:image")
      ? imgProduct.split(",")[1]
      : imgProduct;
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    const name = txtName.trim();
    const price = parseInt(txtPrice.replace(/\./g, ""));
    const discount = parseFloat(txtDiscount) || 0; // Giá trị khuyến mãi
    const discountedPrice = parseInt(txtDiscountedPrice.replace(/\./g, "")); // Giá đã khuyến mãi
    const category = { _id: cmbCategory };
    const image = prepareImageBase64();

    if (name && price > 0 && category._id && image) {
      const prod = { name, price, discount, discountedPrice, category, image }; // Thêm cả discountedPrice
      apiInsertProduct(prod);
    } else {
      setNotification({
        message: "Vui lòng điền đầy đủ thông tin và chọn ảnh!",
        type: "error",
      });
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    const id = txtID;
    const name = txtName.trim();
    const price = parseInt(txtPrice.replace(/\./g, ""));
    const discount = parseFloat(txtDiscount) || 0; // Giá trị khuyến mãi
    const discountedPrice = parseInt(txtDiscountedPrice.replace(/\./g, "")); // Giá đã khuyến mãi
    const category = { _id: cmbCategory };
    const image = prepareImageBase64();

    if (id && name && price > 0 && category._id && image) {
      const prod = {
        _id: id,
        name,
        price,
        discount,
        discountedPrice,
        category,
        image,
      }; // Thêm cả discountedPrice
      apiUpdateProduct(prod);
    } else {
      setNotification({
        message: "Vui lòng điền đầy đủ thông tin và chọn ảnh!",
        type: "error",
      });
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const id = txtID;
      if (id) apiDeleteProduct(id);
      else
        setNotification({
          message: "Không có sản phẩm để xóa!",
          type: "error",
        });
    }
  };

  const handleClearClick = () => {
    setTxtID("");
    setTxtName("");
    setTxtPrice("");
    setTxtDiscount("0");
    setTxtDiscountedPrice("");
    setCmbCategory(categories.length > 0 ? categories[0]._id : "");
    setImgProduct("");
    setInitialImageBase64("");
    setImageFile(null);
  };

  const apiInsertProduct = async (prod) => {
    try {
      const config = { headers: { "x-access-token": getToken() } };
      const res = await axios.post("/api/admin/products", prod, config);
      if (res.status === 200 || res.status === 201) {
        updateProducts("Thêm sản phẩm thành công!", "success"); // Gọi updateProducts
        onClose(); // Đóng modal ngay lập tức
      } else {
        setNotification({
          message: "Thêm sản phẩm thất bại!",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Lỗi khi thêm sản phẩm: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
    }
  };

  const apiUpdateProduct = async (prod) => {
    try {
      const config = { headers: { "x-access-token": getToken() } };
      const res = await axios.put(
        `/api/admin/products/${prod._id}`,
        prod,
        config
      );
      if (res.status === 200) {
        updateProducts("Cập nhật sản phẩm thành công!", "success"); // Gọi updateProducts
        onClose(); // Đóng modal ngay lập tức
      } else {
        setNotification({
          message: "Cập nhật sản phẩm thất bại!",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Lỗi khi cập nhật sản phẩm: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
    }
  };

  const apiDeleteProduct = async (id) => {
    try {
      const config = { headers: { "x-access-token": getToken() } };
      const res = await axios.delete(`/api/admin/products/${id}`, config);
      if (res.status === 200) {
        updateProducts("Xóa sản phẩm thành công!", "success"); // Gọi updateProducts
        onClose(); // Đóng modal ngay lập tức
      } else {
        setNotification({
          message: "Xóa sản phẩm thất bại!",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Lỗi khi xóa sản phẩm: ${
          error.response?.data?.message || error.message
        }`,
        type: "error",
      });
    }
  };

  const cates = categories.map((cate) => (
    <option key={cate._id} value={cate._id}>
      {cate.name}
    </option>
  ));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl relative">
        {/* Notification */}
        {notification.message && (
          <div
            className={`fixed top-4 right-4 bg-white border shadow-md rounded-lg p-3 text-sm font-semibold transition-opacity duration-300 ${
              notification.type === "success"
                ? "text-green-600 border-green-200"
                : "text-red-600 border-red-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">PRODUCT DETAIL</h2>
        <div className="overflow-y-auto max-h-[80vh] px-2">
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="txtID" className="block text-sm font-bold mb-1">
                ID
              </label>
              <input
                type="text"
                id="txtID"
                value={txtID}
                onChange={handleChangeID}
                readOnly={item !== null}
                className="bg-gray-100 w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label htmlFor="txtName" className="block text-sm font-bold mb-1">
                Name
              </label>
              <input
                type="text"
                id="txtName"
                value={txtName}
                onChange={handleChangeName}
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label
                htmlFor="txtPrice"
                className="block text-sm font-bold mb-1"
              >
                Price
              </label>
              <input
                type="text"
                id="txtPrice"
                value={txtPrice}
                onChange={handleChangePrice}
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label
                htmlFor="txtDiscount"
                className="block text-sm font-bold mb-1"
              >
                Discount (%)
              </label>
              <input
                type="number"
                id="txtDiscount"
                value={txtDiscount}
                onChange={handleChangeDiscount}
                min="0"
                max="100"
                className="w-full border rounded py-2 px-3"
              />
            </div>
            <div>
              <label
                htmlFor="txtDiscountedPrice"
                className="block text-sm font-bold mb-1"
              >
                Discounted Price
              </label>
              <input
                type="text"
                id="txtDiscountedPrice"
                value={txtDiscountedPrice}
                readOnly
                className="w-full border rounded py-2 px-3 bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="cmbCategory"
                className="block text-sm font-bold mb-1"
              >
                Category
              </label>
              <select
                id="cmbCategory"
                value={cmbCategory}
                onChange={handleChangeCategory}
                className="w-full border rounded py-2 px-3"
              >
                <option value="">-- Select a Category --</option>
                {cates}
              </select>
            </div>
            <div>
              <label
                htmlFor="fileImage"
                className="block text-sm font-bold mb-1"
              >
                Image
              </label>
              <input
                type="file"
                id="fileImage"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleChangeFile}
                className="block w-full text-sm text-gray-500"
              />
              {imgProduct && (
                <img
                  src={imgProduct}
                  alt="Product"
                  className="mt-3 max-h-40 mx-auto object-contain"
                />
              )}
            </div>

            <div className="flex justify-end mt-4 flex-wrap gap-2">
              {!item ? (
                <button
                  onClick={handleAddClick}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                >
                  ADD
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdateClick}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    UPDATE
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleClearClick}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                CLEAR
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
              >
                DELETE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
