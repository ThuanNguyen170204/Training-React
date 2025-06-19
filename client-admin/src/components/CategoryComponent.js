import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";
import CategoryDetail from "./CategoryDetailComponent";
import UpdateCategory from "./UpdateCategoryComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Category = () => {
  const context = useContext(MyContext);
  const [categories, setCategories] = useState([]);
  const [itemSelected, setItemSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

  useEffect(() => {
    apiGetCategories();
  }, []);

  const apiGetCategories = async () => {
    localStorage.setItem("authToken", context.token);
    const gettoken = localStorage.getItem("authToken");
    const config = { headers: { "x-access-token": gettoken } };
    const res = await axios.get("/api/admin/categories", config);
    setCategories(res.data);
  };

  const handleItemClick = (item) => {
    setItemSelected(item); // Cập nhật mục đã chọn
  };

  const openModal = () => {
    setItemSelected(null); // Đặt mục chọn là null để tạo danh mục mới
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-3xl font-bold text-left mb-2 sm:mb-0 text-gray-700">
        CATEGORY
      </h2>

      <div className="flex">
        <div className="flex-1 p-4">
          {itemSelected ? (
            <CategoryDetail
              item={itemSelected}
              updateCategories={setCategories}
            />
          ) : (
            <div className="text-center">
              Please select a category to view details
            </div>
          )}
        </div>
        <div className="w-2/4 p-4 border-gray-300">
          <h2 className="text-center text-black text-2xl mb-4">
            Category List
          </h2>
          <div className="flex items-center space-x-4 flex-wrap justify-end mb-4">
            <button
              onClick={openModal}
              className="bg-white text-black px-4 py-2 border rounded-md hover:bg-gray-200"
            >
              + New Category
            </button>
          </div>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Icon</th>{" "}
                {/* Thêm cột cho icon */}
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <td className="border px-4 py-2 text-center">{item.name}</td>
                  <td className="border px-4 py-2 text-center">
                    {item.icon && !item.icon.startsWith("data:image") ? (
                      <i className={`${item.icon} text-lg`}></i>
                    ) : item.icon && item.icon.startsWith("data:image") ? (
                      <img
                        src={item.icon}
                        alt="icon"
                        className="w-6 h-6 mx-auto object-contain"
                      />
                    ) : item.image ? (
                      <img
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt="image"
                        className="w-6 h-6 mx-auto object-contain"
                      />
                    ) : (
                      <span className="text-gray-400">No icon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <div>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded"
              >
                x
              </button>
            </div>
            <h2 className="text-center text-xl mb-4 ">Add New Category</h2>
            <UpdateCategory
              item={itemSelected}
              updateCategories={setCategories}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
