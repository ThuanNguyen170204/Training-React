import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom"; // Thêm Link
import MyContext from "../../contexts/MyContext";

function MyOrders() {
  const { token, customer } = useContext(MyContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (customer) {
      const fetchOrders = async () => {
        try {
          const config = { headers: { "x-access-token": token } };
          const res = await axios.get(
            `/api/customer/orders/customer/${customer._id}`,
            config
          );
          setOrders(res.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };
      fetchOrders();
    }
  }, [customer, token]);

  if (!token) return <Navigate replace to="/login" />;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl ">
      {/* Navigation Tabs */}

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-xl font-bold text-gray-700">
          Lịch sử mua hàng
        </span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm text-gray-700">
          <button
            className="px-4 py-2 bg-white border-r border-gray-300 focus:outline-none"
            type="button"
          >
            01/12/2020
          </button>
          <span className="px-2">→</span>
          <button
            className="px-4 py-2 bg-white border-l border-gray-300 focus:outline-none"
            type="button"
          >
            04/06/2025
          </button>
          <button
            aria-label="Calendar icon"
            className="px-3 py-2 bg-white border-l border-gray-300 text-gray-600 hover:text-gray-800 focus:outline-none"
            type="button"
          >
            <i className="far fa-calendar-alt"></i>
          </button>
        </div>
      </div>

      {/* Order Cards */}
      {orders.map((item) => (
        <div
          key={item.orderId}
          className="border mb-4 border-gray-300 rounded-lg p-4 text-sm text-gray-700 max-w-full "
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 text-xs text-black mb-1 md:mb-0">
                <span className="font-bold text-l">
                  Mã Đơn Hàng:
                  <span className="font-bold text-gray-500">"{item._id}"</span>
                </span>
                <span className="inline-flex items-center gap-1">•</span>
                <span className="font-bold text-l">
                  Ngày đặt hàng:
                  <span className="font-bold text-gray-500">
                    {new Date(item.cdate).toLocaleString()}
                  </span>
                </span>
                <div>
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs rounded-md px-2 py-1 select-none">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            {item.items.length > 0 && (
              <img
                src={`data:image/jpg;base64,${item.items[0].product.image}`}
                className="mr-4"
                height="80"
                width="80"
                alt="Product"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-black leading-tight truncate">
                {item.items.length > 0 && item.items[0].product.name}
              </p>
              <p className="text-sm text-black mt-0.5 leading-tight">
                {item.items.length > 0 && item.items[0].product ? (
                  item.items[0].product.discount > 0 ? (
                    <>
                      <span className="text-red-500 font-bold">
                        {item.items[0].product.discountedPrice.toLocaleString(
                          "vi-VN"
                        ) + "đ"}
                      </span>
                      <span className="text-gray-400 text-xs line-through">
                        {item.items[0].product.price.toLocaleString("vi-VN") +
                          "đ"}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-500 font-bold">
                      {item.items[0].product.price.toLocaleString("vi-VN") +
                        "đ"}
                    </span>
                  )
                ) : (
                  <span className="text-red-500 font-bold">Không có giá</span>
                )}
              </p>
              <span className="inline-block bg-[#b9e6eb] text-[#0a7c8f] text-xs rounded-md px-2 py-0.5 mt-1 select-none">
                Đã xuất VAT
              </span>
            </div>
            <div className="text-right min-w-[140px] flex flex-col justify-center">
              <p className="text-xs text-gray-700 mb-1">
                Tổng thanh toán:
                <span className="text-[#c80000] font-bold">
                  {Math.round(item.total).toLocaleString("vi-VN") + "đ"}
                </span>
              </p>
              <Link
                to={`/order/${item._id}`}
                className="text-xs text-black flex items-center gap-1 hover:underline focus:outline-none"
              >
                Xem chi tiết
                <i className="fas fa-chevron-right text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
