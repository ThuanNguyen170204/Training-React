import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MyContext from "../contexts/MyContext";

const CategoryDetail = ({ item, updateCategories }) => {
  const context = useContext(MyContext);
  const [txtID, setTxtID] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtIcon, setTxtIcon] = useState(""); // Icon class (FontAwesome)
  const [txtImage, setTxtImage] = useState(""); // Ảnh dạng base64

  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    if (item) {
      setTxtID(item._id);
      setTxtName(item.name);
      setTxtIcon(item.icon || "");
      setTxtImage(item.image || ""); // Gán ảnh từ DB nếu có
    }
  }, [item]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1]; // Chỉ lấy phần base64
        setTxtImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const btnUpdateClick = async (e) => {
    e.preventDefault();
    if (txtID && txtName) {
      const gettoken = localStorage.getItem("authToken");
      const config = {
        headers: {
          "x-access-token": gettoken,
        },
      };

      const category = {
        name: txtName,
        icon: txtIcon,
        image: txtImage,
      };

      try {
        const res = await axios.put(
          `/api/admin/categories/${txtID}`,
          category,
          config
        );
        if (res.data) {
          setNotification({
            message: "Category updated successfully!",
            type: "success",
          });
          apiGetCategories();
        }
      } catch (error) {
        console.error(error);
        setNotification({ message: "Error updating category!", type: "error" });
      }
    } else {
      setNotification({ message: "Please input ID and Name", type: "error" });
    }
  };

  const btnDeleteClick = async (e) => {
    e.preventDefault();
    if (window.confirm("ARE YOU SURE?")) {
      try {
        const gettoken = localStorage.getItem("authToken");
        const config = { headers: { "x-access-token": gettoken } };
        const res = await axios.delete(
          `/api/admin/categories/${txtID}`,
          config
        );
        if (res.data) {
          setNotification({
            message: "Category deleted successfully!",
            type: "success",
          });
          apiGetCategories();
        }
      } catch (error) {
        console.error(error);
        setNotification({ message: "Error deleting category!", type: "error" });
      }
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

      <h2 className="text-center text-xl">Category Detail</h2>
      <form>
        <div className="mb-4">
          <label>ID</label>
          <input
            type="text"
            value={txtID}
            readOnly
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label>Name</label>
          <input
            type="text"
            value={txtName}
            onChange={(e) => setTxtName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label>Icon Class (Font Awesome)</label>
          <input
            type="text"
            value={txtIcon}
            onChange={(e) => setTxtIcon(e.target.value)}
            className="border p-2 w-full"
            placeholder="Ex: fa fa-phone"
          />
        </div>
        <div className="mb-4">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full"
          />
          {txtImage && (
            <img
              src={
                txtImage.startsWith("data:")
                  ? txtImage
                  : `data:image/jpeg;base64,${txtImage}`
              }
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover border"
            />
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={btnUpdateClick}
            className="bg-gray-100 border rounded-md border-gray-200 hover:bg-gray-200 text-black p-2 mr-2"
          >
            <i className="fa fa-floppy-o" aria-hidden="true"></i> Update
          </button>
          <button
            onClick={btnDeleteClick}
            className="bg-gray-100 border rounded-md text-black p-2 hover:bg-red-500"
          >
            <i className="fa fa-trash" aria-hidden="true"></i> Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryDetail;
