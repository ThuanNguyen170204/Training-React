import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyContext from "../contexts/MyContext";

function Description() {
  const context = useContext(MyContext);
  const { productId } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [descriptionData, setDescriptionData] = useState(defaultDescription());
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  function defaultDescription() {
    return {
      _id: null,
      content: "",
      highlight: "",
      screensize: "",
      chip: "",
      pin: "",
      screen_technology: "",
      rear_camera: "",
      front_camera: "",
      internal_memory: "",
      sim_card: "",
      operating_system: "",
      screen_resolution: "",
      cpu: "",
      compatible: "",
    };
  }

  const fetchProductById = async (id) => {
    try {
      const config = { headers: { "x-access-token": context.token } };
      const response = await axios.get(`/api/admin/products/${id}`, config);

      // Nếu backend trả về { success, product: {...} }
      return response.data.product; // ✅ Đảm bảo đây là object có _id
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi khi tải sản phẩm!");
    }
  };

  const fetchProductDescription = async (productId) => {
    try {
      const config = { headers: { "x-access-token": context.token } };
      const response = await axios.get(
        `/api/admin/product-descriptions/${productId}`,
        config
      );
      setDescriptionData(response.data || defaultDescription());
    } catch (error) {
      if (error.response?.status === 404) {
        setDescriptionData(defaultDescription());
      } else {
        console.error("Lỗi khi lấy mô tả:", error);
        setNotification({
          message: "Lỗi khi lấy mô tả sản phẩm!",
          type: "error",
        });
      }
    }
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setDescriptionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDescription = async () => {
    if (!selectedProduct || !selectedProduct._id) {
      setNotification({
        message: "Không xác định được sản phẩm.",
        type: "error",
      });
      return;
    }

    const dataToSend = { ...descriptionData, productId: selectedProduct._id };
    console.log("📤 Gửi lên server:", dataToSend);

    try {
      const response = descriptionData._id
        ? await axios.put(
            `/api/admin/product-descriptions/${descriptionData._id}`,
            dataToSend,
            { headers: { "x-access-token": context.token } }
          )
        : await axios.post("/api/admin/product-descriptions", dataToSend, {
            headers: { "x-access-token": context.token },
          });

      setNotification({
        message: response.data.message || "Lưu thành công!",
        type: "success",
      });

      // Sau khi lưu thì fetch lại
      await fetchProductDescription(selectedProduct._id);
    } catch (error) {
      console.error("❌ POST/PUT error:", error.response?.data);
      setNotification({
        message:
          "Lưu mô tả thất bại: " + (error.response?.data?.message || "Lỗi!"),
        type: "error",
      });
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Không tìm thấy productId!");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const product = await fetchProductById(productId); // ✅
        setSelectedProduct(product); // ✅
        await fetchProductDescription(productId);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (isLoading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 relative">
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

      <h2 className="text-2xl font-bold mb-6 text-gray-600">Describe</h2>

      {selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-6xl w-full">
          <h3 className="flex text-xl font-bold mb-2">
            Product:
            <div className="pl-2 text-gray-500">{selectedProduct.name}</div>
          </h3>
          <table className="min-w-full">
            <tbody>
              {Object.keys(descriptionData).map(
                (key) =>
                  key !== "_id" && (
                    <tr key={key}>
                      <td className="text-l px-4 py-2 w-1/5">
                        <label>{key.replace(/_/g, " ").toUpperCase()}</label>
                      </td>
                      <td className="px-4 py-2 w-4/5">
                        <textarea
                          name={key}
                          value={descriptionData[key]}
                          onChange={handleDescriptionChange}
                          className="border rounded p-2 w-full font-mono resize-y"
                          placeholder={`Input ${key.replace(/_/g, " ")}`}
                          rows="1"
                        />
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveDescription}
              className="bg-green-500 text-white px-4 py-2 rounded hover:text-gray-500"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Description;
