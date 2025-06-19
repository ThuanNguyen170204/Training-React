import React, { useContext, useRef, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MyContext from "../../contexts/MyContext";
import withRouter from "../../utils/withRouter";
import { FaBars } from "react-icons/fa";

// Fetch categories
const fetchCategories = async () => {
  const response = await axios.get("/api/customer/categories");
  return response.data;
};

function Header(props) {
  const context = useContext(MyContext);
  const { token, mycart, customer } = context;
  const navigate = useNavigate();

  const {
    data: categories = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = () => {
    setIsMenuOpen(false);
  };

  const btnSearchClick = (e) => {
    e.preventDefault();
    if (props.txtKeyword) {
      props.navigate("/product/search/" + props.txtKeyword);
    }
  };
  const handleTrackOrder = () => {
    if (!token) {
      navigate("/login"); // Chưa đăng nhập thì chuyển sang login
    } else {
      navigate("/myorders"); // Đã đăng nhập thì đi đến tra cứu đơn hàng
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="w-full fixed top-0 z-50 shadow-md bg-white">
      {/* Header */}
      <div className="w-full bg-red-800">
        <div className="mx-auto max-w-7xl flex flex-col xl:flex-row justify-between items-center  ">
          {/* Logo */}
          <div className="flex items-center">
            <Link className="flex items-center" to="/home">
              <img
                alt="Logo"
                className="h-15 pt-2 pb-2"
                src="images/Logo/Logo-1.png?v=1"
                width="70"
              />
              <img
                alt="Logo Name"
                className=" h-15 pt-2 pl-1 "
                src="images/Logo/Name-1.png?v=1"
                width="150"
              />
            </Link>
          </div>

          {/* Danh mục và Tìm kiếm */}
          <div className="relative  flex items-center space-x-4">
            {!props.shouldHideMenu && (
              <div className="relative">
                <div className="hidden xl:block">
                  <div className="group relative">
                    <button
                      className="flex items-center hover:border-red-800  py-4 hover:bg-red-900 rounded-xl px-2 text-white text-ml font-bold"
                      type="button"
                    >
                      <FaBars className="mr-1" /> Danh Mục
                    </button>
                    <div className="absolute left-0 hidden font-medium text-gray-700 group-hover:block bg-white border rounded-xl shadow-lg z-50 w-[200px]">
                      <ul className="flex flex-col">
                        {categories.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/product/category/${item._id}`}
                              className="flex block px-4 py-2 rounded-xl hover:bg-red-100"
                              onClick={handleCategoryClick}
                            >
                              {item.icon && item.icon.startsWith("fa") ? (
                                <i className={`${item.icon} ml-1 mr-2`}></i>
                              ) : item.image ? (
                                // Nếu là ảnh base64 đầy đủ
                                <img
                                  src={
                                    item.image.startsWith("data:image")
                                      ? item.icon
                                      : `data:image/jpeg;base64,${item.image}`
                                  }
                                  alt="image"
                                  className="w-5 h-5 mr-1 object-contain"
                                />
                              ) : (
                                // Không có icon hay ảnh
                                <span className="w-5 h-5 mr-2 text-gray-300"></span> // biểu tượng mặc định
                              )}
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="xl:hidden flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-2xl p-2 hover:bg-gray-400 rounded-xl text-black bg-red-900"
                  >
                    <FaBars />
                  </button>
                  {isMenuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute top-full left-0 rounded-xl bg-white shadow-lg border mt-2 z-50 w-48"
                    >
                      <ul className="flex flex-col">
                        {categories.map((item) => (
                          <li key={item._id}>
                            <Link
                              to={`/product/category/${item._id}`}
                              className="flex block px-3 py-2 rounded-xl hover:bg-red-100"
                              onClick={handleCategoryClick}
                            >
                              {item.icon && item.icon.startsWith("fa") ? (
                                <i className={`${item.icon} mr-2`}></i>
                              ) : item.image ? (
                                // Nếu là ảnh base64 đầy đủ
                                <img
                                  src={
                                    item.image.startsWith("data:image")
                                      ? item.icon
                                      : `data:image/jpeg;base64,${item.image}`
                                  }
                                  alt="image"
                                  className="w-5 h-5 mr-1 object-contain"
                                />
                              ) : (
                                // Không có icon hay ảnh
                                <span className="w-5 h-5 mr-2 text-gray-300"></span> // biểu tượng mặc định
                              )}
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tìm kiếm */}
            <form onSubmit={btnSearchClick} className="flex">
              <input
                className="px-3 py-2 text-black border rounded-xl w-[150px] xl:w-[400px] md:w-[300px] border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                type="search"
                placeholder="Bạn cần tìm gì?"
                value={props.txtKeyword}
                onChange={(e) => props.setTxtKeyword(e.target.value)}
              />
            </form>
            <button
              className="flex hidden md:block items-center py-4 space-x-1 hover:text-yellow-200 rounded-xl px-2 text-white text-sm font-bold"
              type="button"
            >
              <i className="fas fa-phone-alt text-base"></i>
              <a className="font-bold text-sm hidden md:block">1800.2097</a>
            </button>

            {/* Tra cứu đơn hàng */}
            <button
              onClick={handleTrackOrder}
              className="flex items-center py-4 space-x-1 hover:text-yellow-200 rounded-xl px-2 text-white text-sm font-bold"
              type="button"
            >
              <i className="fas fa-truck"></i>
              <span className="hidden md:block">Tra cứu đơn hàng</span>
            </button>

            {/* Giỏ hàng */}
            <div className="flex items-center space-x-1 hover:text-yellow-200 text-white text-sm font-bold">
              <Link to="/mycart">
                <i className="fas fa-shopping-cart text-lg"></i>
              </Link>
              {token === "" ? (
                <Link to="/mycart">
                  <button className="hidden md:block">Giỏ hàng</button>
                </Link>
              ) : (
                <Link to="/mycart">
                  <p>{mycart.length}</p>
                </Link>
              )}
            </div>

            {/* Tài khoản người dùng */}
            <div className="flex items-center space-x-1 hover:text-yellow-200 text-white text-sm font-bold">
              <Link to={token === "" ? "/login" : "/myprofile"}>
                <i className="fas fa-user-circle text-xl"></i>
              </Link>
              {token === "" ? (
                <Link to="/login">
                  <button className="hidden md:block">Đăng nhập</button>
                </Link>
              ) : (
                <Link to="/myprofile">
                  <p>{customer.name}</p>
                </Link>
              )}
            </div>
          </div>

          {/* Thông tin liên hệ và tùy chọn */}
        </div>
      </div>
    </div>
  );
}

export default withRouter(Header);
