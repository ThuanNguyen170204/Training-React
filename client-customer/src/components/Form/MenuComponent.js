import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import withRouter from "../../utils/withRouter";

function Menu() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/customer/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  return (
    <div className="w-full bg-white border rounded-xl shadow">
      {/* Navigation */}
      <nav>
        <ul className="flex flex-wrap items-center justify-center gap-7 px-4 py-2">
          {categories.map((item) => (
            <li key={item._id}>
              <Link to={`/product/category/${item._id}`}>
                <button className="flex items-center block w-full text-left px-5 py-2 rounded-md font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200">
                  {/* Hiển thị icon Font Awesome nếu là class icon */}
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
                      alt="icon"
                      className="w-5 h-5 mr-1 object-contain"
                    />
                  ) : (
                    // Không có icon hay ảnh
                    <span className="w-5 h-5 mr-2 text-gray-300"></span> // biểu tượng mặc định
                  )}
                  {item.name}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default withRouter(Menu);
