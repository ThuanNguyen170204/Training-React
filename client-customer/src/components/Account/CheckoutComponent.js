import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MyContext from "../../contexts/MyContext";

function CheckoutPage() {
  const context = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { items = [], total = 0, customer = null } = location.state || {};

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [voucher, setVoucher] = useState("");
  const [notification, setNotification] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setNotification("Vui lòng điền đầy đủ thông tin người nhận");
      return;
    }

    const orderData = {
      items,
      total,
      customer,
      receiver: { name, phone, address },
      voucher,
    };

    try {
      const config = {
        headers: {
          "x-access-token": context.token,
        },
      };

      const res = await axios.post("/api/customer/checkout", orderData, config);
      if (res.data) {
        context.setMycart([]);
        navigate("/myorders");
      } else {
        setNotification("Đặt hàng thất bại");
      }
    } catch (error) {
      console.error(error);
      setNotification("Đặt hàng thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h1>

      {notification && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {notification}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Tên người nhận</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Số điện thoại</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Địa chỉ giao hàng</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Voucher (nếu có)</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            placeholder="Nhập mã giảm giá"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Sản phẩm</h2>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.product._id} className="border p-3 rounded">
                <div className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>
                    {(item.product.discount > 0
                      ? item.product.discountedPrice
                      : item.product.price
                    ).toLocaleString("vi-VN") + "đ"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right text-xl font-bold text-[#cc0017]">
          Tổng tiền: {total.toLocaleString("vi-VN")}đ
        </div>

        <button
          type="submit"
          className="bg-[#cc0017] text-white px-6 py-3 rounded text-base font-semibold"
        >
          Đặt hàng
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
