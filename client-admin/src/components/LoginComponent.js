import axios from "axios";
import React, { useContext, useState } from "react";
import MyContext from "../contexts/MyContext";

const Login = () => {
  const context = useContext(MyContext); // using useContext to access global state
  const [txtUsername, setTxtUsername] = useState("admin");
  const [txtPassword, setTxtPassword] = useState("123");

  const btnLoginClick = (e) => {
    e.preventDefault();
    if (txtUsername && txtPassword) {
      const account = { username: txtUsername, password: txtPassword };
      apiLogin(account);
    } else {
      alert("Please input username and password");
    }
  };

  const apiLogin = (account) => {
    axios.post("/api/admin/login", account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        context.setToken(result.token);
        context.setUsername(account.username);
      } else {
        alert(result.message);
      }
    });
  };

  if (context.token === "") {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4 relative">
        <form
          className="w-full max-w-md shadow-lg bg-white rounded-lg border-2 border-gray-200 p-8 space-y-6"
          aria-label="Login form"
        >
          <div className="flex justify-center items-center">
            <img
              alt="Logo"
              className="h-15 "
              src="images/LogoThuongHieu.png"
              width="170"
              height="10"
            />
          </div>

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
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-black"
            >
              Mật khẩu
            </label>
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

          <p className="text-center text-black text-sm mt-4"></p>
        </form>
      </div>
    );
  }
  return <div />;
};

export default Login;
