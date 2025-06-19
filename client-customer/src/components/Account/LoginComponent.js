import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../contexts/MyContext";
import withRouter from "../../utils/withRouter";
import { Link } from "react-router-dom";

function Login(props) {
  const context = useContext(MyContext);
  const [txtUsername, setTxtUsername] = useState("");
  const [txtPassword, setTxtPassword] = useState("");
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

  const btnLoginClick = (e) => {
    e.preventDefault();
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      apiLogin(account);
    } else {
      setNotification({
        message: "Please input username and password",
        type: "error",
      });
    }
  };

  const apiLogin = async (account) => {
    try {
      const res = await axios.post("/api/customer/login", account);
      const result = res.data;
      if (result.success) {
        setNotification({ message: "Đăng nhập thành công", type: "success" });
        context.setToken(result.token);
        context.setCustomer(result.customer);
        props.navigate("/home");
      } else {
        setNotification({
          message: result.message || "Đăng nhập thất bại",
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message:
          "Có lỗi xảy ra: " +
          (error.response?.data?.message || "Vui lòng thử lại."),
        type: "error",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
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

      <form
        className="w-full max-w-md shadow-lg bg-white rounded-lg border-2 border-gray-200 p-8 space-y-6"
        aria-label="Login form"
      >
        <h2 className="text-2xl pb-4 text-gray-500 font-bold text-black">
          Đăng nhập
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-semibold text-black"
          >
            Tên đăng nhập
          </label>
          <input
            id="user"
            type="text"
            value={txtUsername}
            placeholder="Enter your Username"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            required
            onChange={(e) => setTxtUsername(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-black"
          >
            Mật khẩu
          </label>
          <a
            href="/resetpassword"
            className="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
        <input
          id="pass"
          type="password"
          value={txtPassword}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          required
          onChange={(e) => setTxtPassword(e.target.value)}
          placeholder="Enter your Password"
        />
        <button
          type="submit"
          className="w-full bg-black text-white font-semibold rounded-md py-3 mt-4 hover:bg-gray-900 transition-colors"
          onClick={btnLoginClick}
        >
          Đăng nhập
        </button>
        <button
          type="button"
          className="w-full border border-gray-300 rounded-md py-3 mt-3 text-black hover:bg-gray-50 transition-colors"
        >
          Đăng nhập với Google
        </button>
        <p className="text-center text-black text-sm mt-4">
          Bạn chưa có tài khoản?
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
}

export default withRouter(Login);
