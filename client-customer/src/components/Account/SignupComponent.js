import axios from "axios";
import MyContext from "../../contexts/MyContext";
import { Link, Navigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";

function Signup() {
  const context = useContext(MyContext);
  const [txtUsername, setTxtUsername] = useState("");
  const [txtPassword, setTxtPassword] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtEmail, setTxtEmail] = useState("");
  const [txtPhone, setTxtPhone] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" }); // State cho thông báo
  const [redirectToLogin, setRedirectToLogin] = useState(false); // State để điều hướng

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [notification]);

  const btnSignupClick = async (e) => {
    e.preventDefault();
    if (txtUsername && txtPassword && txtName && txtEmail && txtPhone) {
      const account = {
        username: txtUsername,
        password: txtPassword,
        name: txtName,
        email: txtEmail,
        phone: txtPhone,
      };
      await apiSignup(account);
    } else {
      setNotification({
        message: "Vui lòng nhập thông tin đầy đủ!",
        type: "error",
      });
    }
  };

  const apiSignup = async (user) => {
    try {
      const res = await axios.post("/api/customer/signup", user);
      const result = res.data;
      if (result.success) {
        setNotification({ message: "Đăng ký thành công", type: "success" });
        // Không set token hay customer, chỉ điều hướng về trang đăng nhập
        setRedirectToLogin(true);
      } else {
        setNotification({ message: result.message, type: "error" });
      }
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      setNotification({ message: "Có lỗi xảy ra khi đăng ký.", type: "error" });
    }
  };

  // Điều hướng nếu đã đăng ký thành công
  if (redirectToLogin) return <Navigate to="/login" />;

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
        aria-label="Signup form"
      >
        <h2 className="text-center font-extrabold text-black text-lg mb-6">
          Register with
        </h2>
        <div className="flex justify-center space-x-8 mb-6 text-sm">
          <button
            aria-label="Đăng ký với Google"
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            type="button"
          >
            <span>Google</span>
          </button>
          <button
            aria-label="Đăng ký với Zalo"
            className="flex items-center space-x-2 text-blue-700 hover:text-blue-900"
            type="button"
          >
            <span>Zalo</span>
          </button>
        </div>
        <input
          className="w-full border-b border-gray-200 placeholder-gray-400 text-gray-700 text-sm py-2 mb-4 focus:outline-none focus:border-gray-400"
          placeholder="Enter the customer's name"
          type="text"
          value={txtName}
          onChange={(e) => setTxtName(e.target.value)}
        />
        <input
          className="w-full border-b border-gray-200 placeholder-gray-400 text-gray-700 text-sm py-2 mb-4 focus:outline-none focus:border-gray-400"
          placeholder="Enter phone number"
          type="tel"
          value={txtPhone}
          onChange={(e) => setTxtPhone(e.target.value)}
        />
        <input
          className="w-full border-b border-gray-200 placeholder-gray-400 text-gray-700 text-sm py-2 mb-4 focus:outline-none focus:border-gray-400"
          placeholder="Enter email"
          type="email"
          value={txtEmail}
          onChange={(e) => setTxtEmail(e.target.value)}
        />
        <input
          className="w-full border-b border-gray-200 placeholder-gray-400 text-gray-700 text-sm py-2 mb-4 focus:outline-none focus:border-gray-400"
          placeholder="Enter your login name"
          type="text"
          value={txtUsername}
          onChange={(e) => setTxtUsername(e.target.value)}
        />
        <input
          className="w-full border-b border-gray-200 placeholder-gray-400 text-gray-700 text-sm py-2 mb-4 focus:outline-none focus:border-gray-400"
          placeholder="Enter password"
          type="password"
          value={txtPassword}
          onChange={(e) => setTxtPassword(e.target.value)}
        />
        <button
          className="w-full bg-black text-white font-semibold rounded-md py-3 mt-4 hover:bg-gray-900 transition-colors"
          type="submit"
          onClick={btnSignupClick}
        >
          Signup
        </button>
        <p className="text-center text-xs text-gray-700">
          Already have an account?
          <Link to="/login">
            <span className="text-sm text-blue-600 hover:text-red-700 ml-1">
              Login
            </span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
