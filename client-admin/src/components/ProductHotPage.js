import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import MyContext from "../contexts/MyContext";

// API lấy danh sách danh mục
const fetchCategories = async (token) => {
  const config = { headers: { "x-access-token": token } };
  const { data } = await axios.get("/api/admin/categories", config);
  return Array.isArray(data) ? data : [];
};

// API lấy sản phẩm theo danh mục
const fetchProductsByCategory = async (categoryId, token) => {
  if (!categoryId) return [];
  const config = { headers: { "x-access-token": token } };
  const { data } = await axios.get("/api/admin/products", {
    ...config,
    params: { categoryId },
  });
  return data.products || [];
};

// API lấy danh sách sản phẩm hot
const fetchHotProducts = async (token) => {
  const config = { headers: { "x-access-token": token } };
  try {
    const { data } = await axios.get("/api/admin/hot-products", config);
    return Array.isArray(data) ? data : data?.products || [];
  } catch (error) {
    throw error;
  }
};

const ProductHotPage = () => {
  const context = useContext(MyContext);
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho ô tìm kiếm

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories", context.token],
    queryFn: () => fetchCategories(context.token),
  });

  const { data: matchedProducts = [], isFetching: isLoadingProducts } =
    useQuery({
      queryKey: ["products-by-category", selectedCategory, context.token],
      queryFn: () => fetchProductsByCategory(selectedCategory, context.token),
      enabled: !!selectedCategory,
    });

  const {
    data: hotProducts = [],
    isLoading: isLoadingHot,
    error: hotError,
  } = useQuery({
    queryKey: ["hot-products", context.token],
    queryFn: () => fetchHotProducts(context.token),
  });

  const addMutation = useMutation({
    mutationFn: (product) => {
      const config = { headers: { "x-access-token": context.token } };
      return axios.post(
        "/api/admin/hot-products",
        {
          productId: product._id,
          name: product.name,
          image: product.image,
          discountedPrice: product.discountedPrice,
        },
        config
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["hot-products", context.token]);
      setSelectedProduct(null);
      setSelectedCategory("");
      alert("Thêm sản phẩm hot thành công!");
    },
    onError: (error) => {
      alert("Thêm sản phẩm hot thất bại: " + error.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => {
      const config = { headers: { "x-access-token": context.token } };
      return axios.delete(`/api/admin/hot-products/${productId}`, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["hot-products", context.token]);
    },
    onError: (error) => {
      alert("Xóa sản phẩm thất bại: " + error.message);
    },
  });

  const handleAddHot = () => {
    if (selectedProduct) {
      addMutation.mutate(selectedProduct);
    } else {
      alert("Vui lòng chọn một sản phẩm để thêm!");
    }
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".dropdown")) return;
    setIsDropdownOpen(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  // Lọc sản phẩm dựa trên tìm kiếm
  const filteredProducts = matchedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  document.addEventListener("click", handleClickOutside);

  if (isLoadingHot) return <p>Đang tải danh sách sản phẩm HOT...</p>;
  if (hotError) return <p>Lỗi khi tải sản phẩm HOT: {hotError.message}</p>;
  if (isLoadingCategories) return <p>Đang tải danh mục...</p>;
  if (categoriesError)
    return <p>Lỗi khi tải danh mục: {categoriesError.message}</p>;

  return (
    <div className="mx-auto p-4 relative">
      <h2 className="text-3xl font-bold text-left mb-2 text-gray-700">
        Product Hot
      </h2>

      <div className="mb-6">
        <div className="dropdown relative">
          <div className="flex">
            <label className="block mb-1 item-center font-medium">
              Select category:
            </label>
            <button
              onClick={toggleDropdown}
              className="w-64 ml-4 border rounded focus:outline-none focus:ring focus:ring-gray-100"
            >
              {selectedCategory
                ? categories.find((cat) => cat._id === selectedCategory)?.name
                : "-- Select category --"}
            </button>
          </div>
          {isDropdownOpen && (
            <ul className="absolute ml-32 z-20 border bg-gray-200 shadow-lg mt-2 rounded-lg ">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="py-1 px-2 ml-4 mr-4 item-center  cursor-pointer"
                  onClick={() => handleSelectCategory(cat._id)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isLoadingProducts && (
          <p className="mt-2 text-gray-500">Loading products...</p>
        )}

        {!isLoadingProducts &&
          selectedCategory &&
          filteredProducts.length > 0 && (
            <div className="mt-2 border top-0 z-10 rounded p-4 bg-white shadow max-h-48 overflow-y-auto">
              {/* Ô tìm kiếm sản phẩm */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 p-2 sticky top-0 z-10 border rounded shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex p-2 border rounded shadow cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectProduct(p)}
                  >
                    {p.image && (
                      <img
                        src={
                          p.image.startsWith("data:image")
                            ? p.image
                            : `data:image/jpg;base64,${p.image}`
                        }
                        alt={p.name}
                        className="object-cover h-12 w-12 rounded mb-2"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150"; // Hình ảnh dự phòng
                        }}
                      />
                    )}
                    <div className="ml-2">
                      <p className="text-xs font-medium max-w-xs">{p.name}</p>
                      <p className="text-xs text-gray-600">Giá: {p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {!isLoadingProducts &&
          selectedCategory &&
          filteredProducts.length === 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Không có sản phẩm nào khớp với tìm kiếm.
            </p>
          )}

        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="mt-4 p-4 border rounded bg-gray-50 shadow">
              <h3 className="text-lg font-semibold">Selected products:</h3>
              {selectedProduct.image && (
                <img
                  src={
                    selectedProduct.image.startsWith("data:image")
                      ? selectedProduct.image
                      : `data:image/jpg;base64,${selectedProduct.image}`
                  }
                  alt={selectedProduct.name}
                  width="70"
                  height="70"
                  className="object-cover mt-2"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/70"; // Hình ảnh dự phòng
                  }}
                />
              )}
              <p className="mt-2">
                <strong>Name:</strong>{" "}
                <span className="max-w-xs truncate">
                  {selectedProduct.name}
                </span>
              </p>
              <p>
                <strong>Price:</strong> {selectedProduct.price}
                <strong> Discount:</strong> {selectedProduct.discount}%
              </p>
              <button
                onClick={handleAddHot}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition duration-200"
                disabled={addMutation.isLoading}
              >
                {addMutation.isLoading ? "Đang thêm..." : "Thêm vào HOT"}
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-center mb-2 text-gray-700">
        List Product Hot
      </h3>
      {hotProducts.length === 0 ? (
        <p>Chưa có sản phẩm nào.</p>
      ) : (
        <div className="overflow-y-auto max-h-96 border rounded shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 sticky top-0 text-left">
              <tr>
                <th className="px-4 py-2 border-b ">Name</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Image</th>
                <th className="px-4 py-2 border-b">Discount</th>
                <th className="px-4 py-2 border-b">Discounted Price</th>
                <th className="px-4 py-2 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {hotProducts.map((hot) => (
                <tr
                  key={hot._id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-2 border-b">
                    <span className="max-w-xs truncate">{hot.name}</span>
                  </td>
                  <td className="px-4 py-2 border-b">{hot.price}</td>
                  <td className="px-4 py-2 border-b">
                    {hot.image && (
                      <img
                        src={
                          hot.image.startsWith("data:image")
                            ? hot.image
                            : `data:image/jpg;base64,${hot.image}`
                        }
                        alt={hot.name}
                        width="70"
                        height="70"
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/70";
                        }}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">{hot.discount}%</td>
                  <td className="px-4 py-2 border-b">{hot.discountedPrice}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => removeMutation.mutate(hot._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition duration-200"
                      disabled={removeMutation.isLoading}
                    >
                      {removeMutation.isLoading ? "Đang xóa..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductHotPage;
