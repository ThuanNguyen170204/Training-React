import React from "react";
import MyContext from "../contexts/MyContext";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const Header = () => {
  const context = useContext(MyContext);
  const [darkMode, setDarkMode] = useState(() => {
    // Lưu trạng thái dark mode vào localStorage để giữ khi refresh
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode); // Lưu lại trạng thái
  }, [darkMode]);

  const lnkLogoutClick = () => {
    context.setToken("");
    context.setUsername("");
  };
  return (
    // <div className="flex items-center just  ify-between bg-white shadow p-4">
    //   <div className="flex space-x-4">
    //     <div className="flex space-x-4">
    //       <div className="flex text-right ">
    //         <span className="mr-2">
    //           <b>{context.username}</b>
    //         </span>
    //         <span className="mx-2">||</span>
    //         <Link
    //           className="text-red-500 hover:text-red-700"
    //           to="/admin/home"
    //           onClick={lnkLogoutClick}
    //         >
    //           Logout
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <form className="flex items-center bg-[#F3F4FF]"></form>
      <nav className="flex items-center space-x-6">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="text-gray-700 text-xl hover:text-blue-600"
        >
          {darkMode ? (
            <i className="fas fa-sun"></i>
          ) : (
            <i className="fas fa-moon"></i>
          )}
        </button>

        <div className="flex items-center space-x-3 cursor-pointer">
          <i class="fa fa-user" aria-hidden="true"></i>
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm leading-none">
              {context.username}
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
