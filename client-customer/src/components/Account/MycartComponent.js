import { useContext, useState, useEffect } from "react";
import MyContext from "../../contexts/MyContext";
import axios from "axios";
import withRouter from "../../utils/withRouter";
import { useLocation, useNavigate } from "react-router-dom";

function Mycart(props) {
  const context = useContext(MyContext);
  const [selectedItems, setSelectedItems] = useState({});
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

  const handleCheckboxChange = (id, price) => {
    setSelectedItems((prevState) => {
      const updatedItems = { ...prevState };
      if (updatedItems[id]) {
        delete updatedItems[id];
      } else {
        updatedItems[id] = price;
      }
      return updatedItems;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allItems = {};
      context.mycart.forEach((item) => {
        const price =
          item.product.discount > 0
            ? item.product.discountedPrice * item.quantity
            : item.product.price * item.quantity;
        allItems[item.product._id] = price;
      });
      setSelectedItems(allItems);
    } else {
      setSelectedItems({});
    }
  };

  const calculateTotal = () => {
    return Object.keys(selectedItems).reduce((total, id) => {
      return total + selectedItems[id];
    }, 0);
  };

  const handleQuantityChange = (id, delta) => {
    const mycart = context.mycart;
    const index = mycart.findIndex((item) => item.product._id === id);
    if (index !== -1) {
      const newQuantity = mycart[index].quantity + delta;
      if (newQuantity > 0) {
        mycart[index].quantity = newQuantity;
        context.setMycart([...mycart]);
        // Cập nhật lại selectedItems nếu sản phẩm đã được chọn
        if (selectedItems[id]) {
          const price =
            mycart[index].product.discount > 0
              ? mycart[index].product.discountedPrice * newQuantity
              : mycart[index].product.price * newQuantity;
          setSelectedItems((prevState) => ({
            ...prevState,
            [id]: price,
          }));
        }
      }
    }
  };

  const lnkRemoveClick = (id) => {
    const mycart = context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      context.setMycart([...mycart]);
      // Xóa sản phẩm khỏi selectedItems nếu có
      const updatedSelectedItems = { ...selectedItems };
      delete updatedSelectedItems[id];
      setSelectedItems(updatedSelectedItems);
    }
  };

  const lnkCheckoutClick = () => {
    if (context.mycart.length > 0) {
      const total = calculateTotal();
      const items = context.mycart.filter(
        (item) => selectedItems[item.product._id]
      );
      const customer = context.customer;
      if (customer) {
        // 👉 Chuyển sang trang checkout kèm dữ liệu
        props.navigate("/checkout", {
          state: {
            items,
            total,
            customer,
          },
        });
      } else {
        setNotification({
          message: "Bạn cần đăng nhập để tiếp tục!",
          type: "error",
        });
        props.navigate("/login");
      }
    } else {
      setNotification({
        message: "Giỏ hàng của bạn đang trống",
        type: "error",
      });
    }
  };

  // const apiCheckout = (total, items, customer) => {
  //   const body = { total, items, customer };
  //   const config = { headers: { "x-access-token": context.token } };
  //   axios
  //     .post("/api/customer/checkout", body, config)
  //     .then((res) => {
  //       if (res.data) {
  //         setNotification({ message: "Đặt hàng thành công!", type: "success" });
  //         context.setMycart([]);
  //         props.navigate("/myorders");
  //       } else {
  //         setNotification({ message: "Đặt hàng thất bại!", type: "error" });
  //       }
  //     })
  //     .catch((error) => {
  //       setNotification({
  //         message: "Đặt hàng thất bại! Có lỗi xảy ra.",
  //         type: "error",
  //       });
  //     });
  // };

  const mycart = context.mycart.map((item) => {
    const isChecked = selectedItems[item.product._id] !== undefined;
    const price = item.product.discountedPrice;
    const originalPrice = item.product.price;
    const totalPrice =
      (item.product.discount > 0 ? price : originalPrice) * item.quantity;

    return (
      <div
        key={item.product._id}
        className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-start space-x-4">
          <div className="relative">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() =>
                handleCheckboxChange(item.product._id, totalPrice)
              }
            />
          </div>
          <div className="relative">
            <img
              className="w-16 h-16 object-contain rounded"
              src={`data:image/jpg;base64,${item.product.image}`}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-base text-gray-900 mb-1">
                {item.product.name}
              </h2>
              <button
                aria-label="Xóa sản phẩm"
                className="text-gray-700 hover:text-gray-900"
                type="button"
                onClick={() => lnkRemoveClick(item.product._id)}
              >
                <i className="fas fa-trash-alt text-lg"></i>
              </button>
            </div>

            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                {item.product.discount > 0 ? (
                  <>
                    <span className="text-red-500 font-bold">
                      {price.toLocaleString("vi-VN") + "đ"}
                    </span>
                    <span className="text-gray-500 text-xs line-through">
                      {originalPrice.toLocaleString("vi-VN") + "đ"}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-red-500 font-bold">
                      {originalPrice.toLocaleString("vi-VN") + "đ"}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  aria-label="Giảm số lượng"
                  className="w-9 h-9 bg-gray-100 rounded-md text-lg font-semibold text-gray-900 flex items-center justify-center"
                  type="button"
                  onClick={() => handleQuantityChange(item.product._id, -1)}
                >
                  -
                </button>
                <input
                  aria-label="Số lượng"
                  className="w-10 h-9 text-center border-gray-200 rounded-md text-gray-900 text-base"
                  readOnly
                  value={item.quantity}
                />
                <button
                  aria-label="Tăng số lượng"
                  className="w-9 h-9 bg-gray-100 rounded-md text-lg font-semibold text-gray-900 flex items-center justify-center"
                  type="button"
                  onClick={() => handleQuantityChange(item.product._id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Promotions */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <span
              aria-hidden="true"
              className="inline-block w-5 h-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center"
            >
              ✓
            </span>
            <span className="text-gray-800 text-base">Chọn khuyến mãi</span>
          </div>
          <div className="ml-7 space-y-1 text-gray-800 text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                checked
                className="w-4 h-4 border border-gray-400 rounded-full cursor-pointer"
                name="promo"
                type="radio"
              />
              <span>Tặng bảo hành mở rộng 12 tháng</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                className="w-4 h-4 border border-gray-400 rounded-full cursor-pointer"
                name="promo"
                type="radio"
              />
              <span>- Tặng PMH: 300.000đ</span>
            </label>
          </div>
        </div>
        {/* Warranty protection */}
        <button
          className="mt-6 w-full flex items-center justify-between text-gray-900 text-base font-normal border border-gray-200 rounded-md py-3 px-4 hover:bg-gray-50"
          type="button"
        >
          <span className="flex items-center space-x-2">
            <i className="fas fa-shield-alt text-lg"></i>
            <span>Bảo vệ toàn diện với Bảo hành mở rộng</span>
          </span>
          <span className="text-[#cc0017] font-normal text-base flex items-center space-x-1">
            <span>chọn gói</span>
            <i className="fas fa-chevron-right"></i>
          </span>
        </button>
      </div>
    );
  });

  return (
    <div className="bg-[#f5f7fa] font-sans text-gray-900 relative">
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

      <div className="max-w-2xl mx-auto bg-[#f5f7fa] min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
          <button aria-label="Back" className="text-2xl text-gray-800">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="font-semibold text-lg text-gray-800">
            Giỏ hàng của bạn
          </h1>
          <div className="w-6"></div>
        </header>
        {/* Main content */}
        <main className="px-6 pt-6 flex-grow">
          <button
            className="mb-4 bg-[#cc0017] text-white text-base font-normal rounded-lg px-5 py-3"
            type="button"
          >
            Giỏ hàng
          </button>
          <form>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2 text-gray-800 text-base cursor-pointer">
                <input
                  className="w-5 h-5 border border-gray-400 rounded-full cursor-pointer"
                  name="selectAll"
                  type="checkbox"
                  onChange={handleSelectAll}
                />
                <span>Chọn tất cả</span>
              </label>
              <button
                className="text-gray-400 italic text-sm cursor-default select-none"
                disabled
                type="button"
              >
                Xóa sản phẩm đã chọn
              </button>
            </div>
            {/* Cart item */}
            <div>{mycart}</div>
          </form>
        </main>
        {/* Footer */}
        <footer className="bg-white border-t border-gray-300 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <p className="text-base font-semibold text-gray-900">
              Tạm tính:
              <span className="text-[#cc0017] font-bold">
                {calculateTotal().toLocaleString("vi-VN") + "đ"}
              </span>
            </p>
            <p className="text-xs text-gray-400 font-normal mt-0.5">
              Chưa gồm chiết khấu SMember
            </p>
          </div>
          <button
            className="bg-[#cc0017] text-white text-base font-normal rounded-lg px-6 py-3"
            type="button"
            onClick={lnkCheckoutClick}
          >
            Mua Hàng
          </button>
        </footer>
      </div>
    </div>
  );
}

export default withRouter(Mycart);
