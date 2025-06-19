import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import MyContext from "../../contexts/MyContext";

function OrderDetailPage() {
  const { token } = useContext(MyContext);
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token && orderId) {
      const fetchOrderDetail = async () => {
        try {
          const config = { headers: { "x-access-token": token } };
          const res = await axios.get(
            `/api/customer/orders/${orderId}`,
            config
          );
          setOrder(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching order detail:", err);
          setError("Không thể tải chi tiết đơn hàng");
          setLoading(false);
        }
      };
      fetchOrderDetail();
    }
  }, [token, orderId]);

  if (!token) return <Navigate replace to="/login" />;
  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!order) return <div className="text-center">Không tìm thấy đơn hàng</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Breadcrumb */}
      <div className="bg-gray-100 border rounded-xl px-5 py-3 flex items-center gap-1 text-[14px] text-[#222222]">
        <i className="fas fa-chevron-left text-[12px]"></i>
        <Link to="/myorders" className="font-semibold hover:underline">
          Lịch sử mua hàng
        </Link>
        <span className="text-[#999999]">/ Chi tiết đơn hàng</span>
      </div>

      {/* Tổng quan */}
      <section className="bg-gray-100 border rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-gray-700 text-[16px]">Tổng quan</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold  text-gray-700 ">
            Đơn hàng:
            <i className="font-bold text-gray-500"> {order._id}</i>
          </span>
          <span>•</span>
          <span className="font-bold text-gray-700 ">
            Ngày đặt hàng:
            <span className="font-bold text-gray-500">
              {new Date(order.cdate).toLocaleString()}
            </span>
          </span>
          <span>•</span>
          <span className="text-[12px] bg-[#d9d9d9] rounded px-2 py-[2px] select-none">
            {order.status}
          </span>
        </div>

        {/* Danh sách sản phẩm trong đơn hàng */}
        {order.items.map((item) => {
          const price =
            item.product.discount > 0
              ? item.product.discountedPrice
              : item.product.price;
          const originalPrice = item.product.price;

          return (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 border-b border-[#d9d9d9] py-4 last:border-b-0"
            >
              <div className="flex  items-center gap-3">
                <img
                  alt={item.product.name}
                  className="w-12 h-12 "
                  height="48"
                  src={`data:image/jpg;base64,${item.product.image}`}
                  width="48"
                />
                <div className="flex flex-col gap-1 max-w-[320px]">
                  <p className="font-bold text-xs text-gray-500">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-2 text-[14px]">
                    {item.product.discount > 0 ? (
                      <>
                        <span className="font-bold text-red-600">
                          {price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="line-through text-[#999999] text-[13px]">
                          {originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-red-600">
                        {originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[14px]">
                <span>
                  Số lượng:
                  <span className="font-normal">{item.quantity}</span>
                </span>
                <button
                  className="border border-red-600 text-red-600 rounded px-4 py-1 text-[14px] font-normal hover:bg-red-50"
                  type="button"
                >
                  Mua lại
                </button>
              </div>
            </div>
          );
        })}

        <a
          className="text-[12px] text-[#1a1aff] hover:underline flex justify-end"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Xem hóa đơn VAT
          <i className="fas fa-external-link-alt ml-1 text-[10px]"></i>
        </a>
      </section>

      {/* Info sections container */}
      <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
        {/* Thông tin khách hàng */}
        <section
          className="bg-gray-100 rounded-xl p-5 flex-1 flex flex-col justify-between"
          style={{ minWidth: "280px" }}
        >
          <h3 className="font-bold text-gray-700 text-[16px] ">
            Thông tin khách hàng
          </h3>
          <div className="space-y-4 text-[14px] text-[#222222]">
            <div className="flex justify-between border-b border-[#d9d9d9] pb-2">
              <span className="text-[#666666]">Họ và tên:</span>
              <span className="font-semibold text-gray-700">
                {order.receiver.name}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#d9d9d9] pb-2">
              <span className="text-[#666666]">Số điện thoại:</span>
              <span className="font-semibold text-gray-700">
                {order.receiver.phone}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#d9d9d9] pb-2">
              <span className="text-[#666666]">Địa chỉ:</span>
              <span className="font-semibold text-gray-700 text-right max-w-[180px]">
                {order.receiver.address}
              </span>
            </div>
            <div className="flex justify-between border-b border-transparent pb-2">
              <span className="text-[#666666]">Ghi chú:</span>
              <span className="font-semibold">{order.note || "-"}</span>
            </div>
          </div>
        </section>

        {/* Thông tin thanh toán */}
        <section
          className="bg-gray-100 rounded-xl p-5 flex-1 flex flex-col justify-between"
          style={{ minWidth: "280px" }}
        >
          <h3 className="font-bold text-gray-700 text-[16px] mb-4">
            Thông tin thanh toán
          </h3>
          <div className="space-y-3 text-[14px] text-[#222222]">
            <div>
              <p className="font-semibold text-gray-700 py-2 select-none text-[14px]">
                Sản phẩm
              </p>
              <div className="flex text-gray-700 font-semibold justify-between border-b border-[#d9d9d9] py-2 ">
                <span>Số lượng sản phẩm:</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between border-b border-[#d9d9d9] py-2 font-semibold">
                <span>Tổng tiền hàng:</span>
                <span className="text-gray-600">
                  {order.total.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex text-gray-700 justify-between border-b border-[#d9d9d9] py-2 ">
                <span className="font-semibold">Giảm giá:</span>
                <span className="text-green-500">{order.discount || "0đ"}</span>
              </div>
              <div className="flex text-gray-700 justify-between border-b border-[#d9d9d9] py-2">
                <span className="font-semibold">Phí vận chuyển:</span>
                <span className="text-green-500">
                  {order.shippingFee || "Miễn phí"}
                </span>
              </div>
            </div>
            <div>
              <p className="font-bold text-gray-500 rounded  py-2 select-none text-[14px]">
                Thanh toán
              </p>
              <div className="flex justify-between py-2 font-bold text-[16px] text-gray-700">
                <span>Tổng số tiền</span>
                <span className="text-red-500">
                  {order.total.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <p className="text-[11px] text-[#666666] leading-tight">
                (Đã bao gồm VAT và được làm tròn)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OrderDetailPage;
