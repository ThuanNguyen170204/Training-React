import axios from "axios";
import MyContext from "../../contexts/MyContext";
import { Link, Navigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";

export default function PWComponent() {
  const { customer } = useContext(MyContext);
  const customerId = customer?._id;
  const context = useContext(MyContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setNotification({
        message: "Mật khẩu xác nhận không khớp.",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.put(
        `/api/customer/reset-password/${customerId}`,
        { newPassword }
      );
      setNotification({
        message: res.data.message || "Cập nhật mật khẩu thành công!",
        type: "success",
      });
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setNotification({
        message: "Có lỗi xảy ra khi đặt lại mật khẩu.",
        type: "error",
      });
    }
  };

  const lnkLogoutClick = () => {
    context.setToken("");
    context.setCustomer(null);
  };

  if (!context.token) return <Navigate replace to="/login" />;

  return (
    <div className="relative">
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

      <div className="flex">
        <div className="w-1/4 bg-white rounded-md p-4 mt-4">
          <ul className="space-y-4">
            <Link to="/myprofile">
              <li className="flex hover:text-red-500 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-user"></i>
                <p className="hidden md:block"> Tài khoản của bạn</p>
              </li>
            </Link>
            <Link to="/myorders">
              <li className="flex hover:text-red-500 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-history"></i>
                <a className="hidden md:block"> Đơn mua hàng</a>
              </li>
            </Link>
            <Link to="/resetpassword">
              <li className="flex hover:text-red-500 bg-red-100 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-unlock-alt text-red-500"></i>
                <a className="text-red-500 hidden md:block">
                  {" "}
                  Đặt lại mật khẩu
                </a>
              </li>
            </Link>
            <Link to="/login" onClick={lnkLogoutClick}>
              <li className="flex hover:text-red-500 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden md:block">Logout</span>
              </li>
            </Link>
          </ul>
        </div>

        <div className="bg-gray-100 w-3/4 p-8 mr-5 mt-4 rounded-md">
          <div className="flex items-center space-x-4">
            <img
              alt="User Avatar"
              className="rounded-full"
              height="50"
              src="https://storage.googleapis.com/a1aa/image/-YxWEnOmZBOkooc6_Syf4QVqdXjyKWmMofmuTWwZsag.jpg"
              width="50"
            />
            <h1 className="text-2xl text-red-500 font-bold">
              {customer?.name}
            </h1>
          </div>
          <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold mb-8">Tạo mật khẩu mới</h1>
            <div className="flex justify-center mb-8"></div>
            <form className="space-y-8">
              <div>
                <label
                  className="block font-semibold mb-2 text-gray-800"
                  htmlFor="new-password"
                >
                  Nhập mật khẩu mới
                </label>
                <input
                  className="w-full border border-gray-200 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  id="new-password"
                  placeholder="Nhập mật khẩu mới của bạn"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="mt-1 text-xs italic text-gray-400"></p>
              </div>
              <div>
                <label
                  className="block font-semibold mb-2 text-gray-800"
                  htmlFor="confirm-password"
                >
                  Xác nhận lại mật khẩu
                </label>
                <input
                  className="w-full border border-gray-200 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  id="confirm-password"
                  placeholder=""
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                className="w-1/4 bg-white text-green-500 font-semibold py-3 rounded-md hover:bg-gray-200 transition-colors"
                type="submit"
                onClick={handleSubmit}
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
