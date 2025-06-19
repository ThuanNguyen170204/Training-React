import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";

const UpdateCategory = ({ item, updateCategories }) => {
  const context = useContext(MyContext);
  const [txtName, setTxtName] = useState("");
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

  useEffect(() => {
    if (item) {
      setTxtName(item.name);
    }
  }, [item]);

  const btnAddClick = async (e) => {
    e.preventDefault();
    const name = txtName;
    if (name) {
      const cate = { name: name };
      await apiPostCategory(cate);
    } else {
      setNotification({ message: "Please input name", type: "error" });
    }
  };

  const apiPostCategory = async (cate) => {
    try {
      const gettoken = localStorage.getItem("authToken");
      const config = { headers: { "x-access-token": gettoken } };
      const res = await axios.post("/api/admin/categories", cate, config);
      if (res.data) {
        setNotification({
          message: "Category added successfully!",
          type: "success",
        });
        apiGetCategories();
      } else {
        setNotification({ message: "Error adding category!", type: "error" });
      }
    } catch (error) {
      setNotification({ message: "Error adding category!", type: "error" });
      console.error("Error adding category:", error);
    }
  };

  const apiGetCategories = async () => {
    const gettoken = localStorage.getItem("authToken");
    const config = { headers: { "x-access-token": gettoken } };
    const res = await axios.get("/api/admin/categories", config);
    updateCategories(res.data);
  };

  return (
    <div className="p-4 relative">
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

      <form>
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            value={txtName}
            onChange={(e) => setTxtName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <button
            onClick={btnAddClick}
            className="bg-green-500 rounded-md hover:bg-gray-700 text-white p-2 mr-2"
          >
            Add New
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
