import React, { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import MyContext from "../../contexts/MyContext";

function Myprofile() {
  const context = useContext(MyContext);
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

  const updateCustomerMutation = useMutation({
    mutationFn: async (customer) => {
      const config = { headers: { "x-access-token": context.token } };
      const id = context.customer._id;
      const res = await axios.put(
        `/api/customer/customers/${id}`,
        customer,
        config
      );
      return res.data;
    },
    onSuccess: (data) => {
      setNotification({ message: "Cập nhật thành công!", type: "success" });
      context.setCustomer(data);
    },
    onError: (error) => {
      console.error("Lỗi cập nhật:", error);
      setNotification({
        message:
          "Cập nhật thất bại: " +
          (error.response?.data?.message || "Lỗi không xác định"),
        type: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");

    if (username && name && phone && email) {
      const customerData = { username, name, phone, email };
      if (password) {
        customerData.password = password; // Chỉ gửi nếu có mật khẩu mới
      }
      updateCustomerMutation.mutate(customerData);
    } else {
      setNotification({
        message: "Vui lòng điền đầy đủ thông tin.",
        type: "error",
      });
    }
  };

  const lnkLogoutClick = () => {
    context.setToken("");
    context.setCustomer(null);
  };

  if (!context.token) return <Navigate replace to="/home" />;

  const customer = context.customer;

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
            <li className="flex items-center space-x-2 bg-red-100 p-4 rounded-md">
              <i className="fas fa-user text-red-500"></i>
              <span className="text-red-500 hidden md:block">
                Tài khoản của bạn
              </span>
            </li>
            <Link to="/myorders">
              <li className="flex hover:text-red-500 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-history"></i>
                <span className="hidden md:block"> Đơn mua hàng</span>
              </li>
            </Link>
            <Link to="/resetpassword">
              <li className="flex hover:text-red-500 items-center space-x-2 p-4 rounded-md">
                <i className="fas fa-unlock-alt"></i>
                <span className="hidden md:block"> Đặt lại mật khẩu</span>
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
            <i
              className="fa fa-user-circle"
              aria-hidden="true"
              style={{ fontSize: "2em" }}
            ></i>
            <h1 className="text-2xl font-bold">{customer?.name}</h1>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label>Tên đăng nhập:</label>
              <input
                name="username"
                defaultValue={customer?.username}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <Link to="/resetpassword">
                <label>Mật khẩu mới:</label>
                <div className="relative">
                  <input
                    id="passwordInput"
                    name="password"
                    type="password"
                    className="border hover:cursor-pointer p-2 w-full pr-10"
                    placeholder="Click vào đây để đặt mật khẩu mới"
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500 select-none"
                    onClick={() => {
                      const input = document.getElementById("passwordInput");
                      if (input) {
                        input.type =
                          input.type === "password" ? "text" : "password";
                      }
                    }}
                  >
                    👁
                  </span>
                </div>
              </Link>
            </div>
            <div>
              <label>Tên khách hàng:</label>
              <input
                name="name"
                defaultValue={customer?.name}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                name="email"
                defaultValue={customer?.email}
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Số điện thoại:</label>
              <input
                name="phone"
                defaultValue={customer?.phone}
                className="border p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Cập nhật
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Myprofile;
