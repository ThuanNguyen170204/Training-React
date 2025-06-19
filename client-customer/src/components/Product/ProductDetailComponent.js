import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import withRouter from "../../utils/withRouter";
import CartUtil from "../../utils/CartUtil";
import { useQuery } from "@tanstack/react-query";
import MyContext from "../../contexts/MyContext";
import ProductInfor from "./Productinformation";

const fetchDescriptions = async (productId) => {
  const response = await axios.get(
    `/api/customer/product-descriptions/${productId}`
  );
  return response.data;
};

function ProductDetail(props) {
  const context = useContext(MyContext);
  const [product, setProduct] = useState(null);
  const [textQuantity, setTextQuantity] = useState(1);
  const [notification, setNotification] = useState({ message: "", type: "" }); // State cho thông báo
  const [pendingAddToCart, setPendingAddToCart] = useState(null);

  const params = props.params;
  const {
    data: descriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["descriptions", params.id],
    queryFn: () => fetchDescriptions(params.id),
    enabled: !!params.id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const params = props.params;
    if (params.id) {
      setProduct(null);
      setTextQuantity(1);
      apiGetProduct(params.id);
    }
  }, [props.params.id]);

  useEffect(() => {
    if (context.customer && pendingAddToCart) {
      // Tự động thêm vào giỏ hàng khi đăng nhập thành công
      btnAdd2CartClick(pendingAddToCart);
      setPendingAddToCart(null); // Reset sau khi thêm
    }
  }, [context.customer]);

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer khi component unmount hoặc notification thay đổi
    }
  }, [notification]);

  const apiGetProduct = async (id) => {
    try {
      const res = await axios.get("/api/customer/products/" + id);
      console.log("Product data from API:", res.data);
      if (res.data && res.data._id) {
        setProduct(res.data);
      } else {
        console.error("Product data or _id is missing", res.data);
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    }
  };

  const btnBuyNowClick = () => {
    const quantity = parseInt(textQuantity);
    const customer = context.customer;

    if (!customer) {
      setNotification({
        message: "Bạn cần đăng nhập để tiếp tục!",
        type: "error",
      });
      props.navigate("/login");
      return;
    }

    if (isNaN(quantity) || quantity < 1) {
      setNotification({
        message: "Vui lòng nhập số lượng hợp lệ!",
        type: "error",
      });
      return;
    }
    if (!product) {
      setNotification({ message: "Sản phẩm không tồn tại!", type: "error" });
      return;
    }

    const items = [{ product: product, quantity: quantity }];
    const total = CartUtil.getTotal(items);
    apiCheckout(total, items, customer);
  };

  const apiCheckout = async (total, items, customer) => {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { "x-access-token": context.token } };
    try {
      const res = await axios.post("/api/customer/checkout", body, config);
      if (res.data) {
        setNotification({ message: "ĐẶT HÀNG THÀNH CÔNG!", type: "success" });
        context.setMycart([]);
        props.navigate("/myorders");
      } else {
        setNotification({ message: "ĐẶT HÀNG THẤT BẠI!", type: "error" });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setNotification({
        message: "Đặt hàng thất bại! Có lỗi xảy ra.",
        type: "error",
      });
    }
  };

  const btnAdd2CartClick = (e) => {
    e.preventDefault();
    if (!product) {
      setNotification({
        message: "Sản phẩm không tồn tại để thêm vào giỏ!",
        type: "error",
      });
      return;
    }

    const quantity = parseInt(textQuantity);
    if (isNaN(quantity) || quantity < 1) {
      setNotification({
        message: "Vui lòng nhập số lượng hợp lệ!",
        type: "error",
      });
      return;
    }

    if (!context.customer) {
      // Lưu thông tin sản phẩm và số lượng để thêm sau khi đăng nhập
      setPendingAddToCart({ product, quantity });
      setNotification({
        message: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!",
        type: "error",
      });
      props.navigate("/login");
      return;
    }

    const mycart = [...context.mycart];
    const index = mycart.findIndex((x) => x.product._id === product._id);
    if (index === -1) {
      const newItem = { product: product, quantity: quantity };
      mycart.push(newItem);
    } else {
      mycart[index].quantity += quantity;
    }
    context.setMycart(mycart);
    setNotification({
      message: "Thêm vào giỏ hàng thành công!",
      type: "success",
    });
  };

  const handleScrollToInfor = (e) => {
    e.preventDefault();
    const inforSection = document.getElementById("specifications-section");
    if (inforSection) {
      inforSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">
          Đang tải sản phẩm hoặc sản phẩm không tồn tại...
        </div>
      </div>
    );
  }

  const descriptionArray = Array.isArray(descriptions)
    ? descriptions
    : [descriptions].filter(Boolean);

  return (
    <div className="bg-white text-gray-900 relative">
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

      <div className="max-w-6xl mx-auto ">
        {/* Breadcrumb */}
        <nav className="flex items-center text-[13px] text-gray-600 space-x-1 mb-4 select-none">
          <a className="flex items-center gap-1 hover:underline" href="/#">
            <i className="fas fa-home text-[11px]"></i>
            <span>Trang chủ</span>
          </a>
          {product.category && (
            <>
              <span>/</span>
              <a
                className="hover:underline"
                href={`/#/category/${product.category._id}`}
              >
                {product.category.name}
              </a>
            </>
          )}
          <span>/</span>
          <span className="text-gray-400">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left side */}
          <div className="flex-1">
            <h1 className="font-bold text-[22px] mb-1">{product.name}</h1>
            <div className="flex items-center space-x-4 text-[14px] text-blue-600 mb-6 select-none">
              <button className="flex items-center gap-1 hover:underline">
                <i className="far fa-heart"></i> Yêu thích
              </button>
              <span className="border-l border-gray-300 h-4"></span>
              <button className="flex items-center gap-1 hover:underline">
                <i className="far fa-comment-alt"></i> Hỏi đáp
              </button>
              <span className="border-l border-gray-300 h-4"></span>
              <a
                href="#specifications-section"
                className="flex items-center gap-1 hover:underline"
                onClick={handleScrollToInfor}
              >
                <i className="fas fa-cogs"></i> Thông số
              </a>
            </div>
            <div
              className="rounded-lg p-6 flex gap-6 mb-4"
              style={{
                background: "linear-gradient(90deg, #d35a7a 0%, #f2a87f 100%)",
              }}
            >
              <div className="bg-white rounded-lg p-4 flex-shrink-0">
                <img
                  alt={product.name}
                  className="w-[200px] h-[200px] sm:w-[160px] sm:h-[160px] object-contain rounded-md"
                  draggable="false"
                  src={"data:image/jpg;base64," + product.image}
                />
              </div>
              <div className="text-white text-[13px] leading-tight max-w-full">
                {descriptionArray.map((item) => (
                  <div key={item._id} style={{ whiteSpace: "pre-wrap" }}>
                    {item.highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="w-full md:w-[360px] mt-6 md:mt-0">
            <div
              className="border border-blue-300 rounded-lg p-4 mb-4 text-gray-700"
              style={{ backgroundColor: "#f5faff" }}
            >
              <div className="text-[14px] mb-1">Giá bán:</div>
              <div className="text-[28px] font-semibold text-red-600 flex items-center gap-1">
                {product.discount > 0 ? (
                  <span className="text-red-600">
                    {product.discountedPrice.toLocaleString("vi-VN") + "đ"}
                  </span>
                ) : (
                  <span className="text-red-600">
                    {product.price.toLocaleString("vi-VN") + "đ"}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số lượng:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={textQuantity}
                onChange={(e) => setTextQuantity(e.target.value)}
                className="w-24 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold text-lg"
                onClick={btnBuyNowClick}
              >
                MUA NGAY
              </button>
              <button
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-lg"
                onClick={btnAdd2CartClick}
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
            {/* thanh thanh toán ở dưới */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 shadow-xl bg-white rounded-xl border border-gray-200 flex items-center gap-3 p-4 max-w-[100%] sm:max-w-4xl w-full">
              <img
                alt={product.name}
                className="w-12 h-12 rounded-md object-contain"
                draggable="false"
                src={"data:image/jpg;base64," + product.image}
              />
              <div className="flex-1 text-sm font-semibold text-gray-900">
                {product.name}
              </div>
              <div className="flex flex-col items-end space-y-0.5 min-w-[120px]">
                <span className="text-red-600 font-bold text-lg leading-none">
                  {product.discount > 0 ? (
                    <span className="text-red-600">
                      {product.discountedPrice.toLocaleString("vi-VN") + "đ"}
                    </span>
                  ) : (
                    <span className="text-red-600">
                      {product.price.toLocaleString("vi-VN") + "đ"}
                    </span>
                  )}
                </span>
                <span className="line-through text-gray-400 text-xs">
                  {product.price.toLocaleString("vi-VN") + "đ"}
                </span>
              </div>
              <button
                className="ml-4 px-4 py-2 border border-blue-500 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition"
                type="button"
              >
                Trả góp 0%
              </button>
              <button
                className="ml-2 px-6 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
                type="button"
                onClick={btnBuyNowClick}
              >
                Mua Ngay
              </button>
              <button
                aria-label="Cart"
                className="ml-2 p-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 transition"
                type="button"
                onClick={btnAdd2CartClick}
              >
                <i className="fas fa-shopping-cart fa-lg"></i>
              </button>
            </div>
            {/*  */}
            <div className="mt-6 p-4 border border-gray-200 rounded-md text-sm">
              <h4 className="font-semibold mb-2 text-gray-800">
                Chính sách bán hàng:
              </h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>
                  <i className="fas fa-check-circle text-green-500 mr-1"></i>{" "}
                  Cam kết hàng chính hãng 100%.
                </li>
                <li>
                  <i className="fas fa-truck text-blue-500 mr-1"></i> Giao hàng
                  toàn quốc.
                </li>
                <li>
                  <i className="fas fa-shield-alt text-purple-500 mr-1"></i> Bảo
                  hành 12 tháng.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded p-1.5">
              <i className="fas fa-check text-white text-sm"></i>
            </div>
            <p className="text-sm leading-tight text-gray-900">
              Máy mới 100%, chính hãng Apple Việt Nam. CellphoneS hiện là đại lý
              bán lẻ uỷ quyền iPhone chính hãng VN/A của Apple Việt Nam
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded p-3 border border-gray-200">
            <img
              alt="Red icon representing USB cable"
              className="w-10 h-10 flex-shrink-0"
              height="40"
              src="https://storage.googleapis.com/a1aa/image/e1164edb-129c-491f-b383-4a0906a5c9e4.jpg"
              width="40"
            />
            <div className="text-xs text-gray-700 leading-snug">
              iPhone 16 Pro Max sử dụng iOS 18, Cáp Sạc USB-C (1m), Tài liệu
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 rounded p-1.5">
                <i className="fas fa-sync-alt text-white text-sm"></i>
              </div>
              <p className="text-sm leading-tight text-gray-900">
                1 ĐỔI 1 trong 30 ngày nếu có lỗi phần cứng nhà sản xuất. Bảo
                hành 12 tháng tại trung tâm bảo hành chính hãng Apple: CareS.vn
                <a className="text-blue-600 underline" href="#">
                  Xem chi tiết
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded p-3 border border-gray-200">
              <img
                alt="Red icon representing Apple warranty"
                className="w-10 h-10 flex-shrink-0"
                height="40"
                src="https://storage.googleapis.com/a1aa/image/c34b610b-fbeb-41a5-49ad-e45181370825.jpg"
                width="40"
              />
              <div className="text-xs text-gray-700 leading-snug">
                Xem thông tin kích hoạt bảo hành các sản phẩm Apple
                <a className="text-blue-600 underline" href="#">
                  Chi tiết tại đây
                </a>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 rounded p-1.5">
                <i className="fas fa-info-circle text-white text-sm"></i>
              </div>
              <p className="text-sm leading-tight text-gray-900">
                Giá sản phẩm đã bao gồm thuế VAT, giúp khách hàng yên tâm và dễ
                dàng trong việc tính toán chi phí.
              </p>
            </div>
          </div>
        </div>

        <div id="specifications-section">
          <ProductInfor />
        </div>
      </div>
    </div>
  );
}

export default withRouter(ProductDetail);
