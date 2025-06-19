import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MyContext from "../contexts/MyContext";
import ProductDetail from "./ProductDetailComponent";
import { useNavigate } from "react-router-dom";

// Fetch categories
const fetchCategories = async (token) => {
  const config = { headers: { "x-access-token": token } };
  const response = await axios.get("/api/admin/categories", config);
  return response.data;
};

// Fetch products
const fetchProducts = async ({ queryKey }) => {
  const [_, { token, page, categoryId, sortOrder, filter }] = queryKey;
  const config = { headers: { "x-access-token": token } };
  const params = { page };
  if (categoryId) params.categoryId = categoryId;
  if (sortOrder) params.sortOrder = sortOrder;
  if (filter) params.filter = filter;

  const response = await axios.get("/api/admin/products", {
    params,
    ...config,
  });
  return response.data;
};

const Product = () => {
  const context = useContext(MyContext);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [itemSelected, setItemSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showIdColumn, setShowIdColumn] = useState(false);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" }); // State cho thông báo

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", context.token],
    queryFn: () => fetchCategories(context.token),
    enabled: !!context.token,
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurPage(1);
  };

  const { data: productsData, refetch } = useQuery({
    queryKey: [
      "products",
      {
        token: context.token,
        page: curPage,
        categoryId: selectedCategoryId,
        sortOrder,
        filter,
      },
    ],
    queryFn: fetchProducts,
    enabled: !!context.token,
    keepPreviousData: true,
  });

  const handlePageClick = (index) => {
    setCurPage(index);
  };

  const handleItemClick = (item) => {
    setItemSelected(item);
    setShowDetail(true);
  };

  const handleAddProductClick = () => {
    setItemSelected(null);
    setShowDetail(true);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setCurPage(1);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurPage(1);
  };

  const navigate = useNavigate();
  const handleAddSpecificationClick = (e, item) => {
    e.stopPropagation();
    navigate(`/admin/product-description/${item._id}`);
  };

  const handleUpdateProducts = (message, type) => {
    setNotification({ message, type });
    if (type === "success") {
      // Delay refetch để người dùng thấy thông báo
      setTimeout(() => {
        refetch(); // Chỉ làm mới dữ liệu sản phẩm
        setCurPage(1); // Chuyển về trang 1 để hiển thị sản phẩm mới
      }, 3000); // Chờ 3 giây để hiển thị thông báo
    }
  };

  // Tự động tắt thông báo sau 3 giây nếu không làm mới
  React.useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderProducts = productsData?.products.map((item) => (
    <tr
      key={item._id}
      className="hover:bg-gray-100 cursor-pointer border-b"
      onClick={() => handleItemClick(item)}
    >
      <td className="px-4 py-2 text-right">
        <img
          src={`data:image/jpg;base64,${item.image}`}
          width="60"
          height="50"
          alt={item.name}
          className="object-cover"
        />
      </td>
      {showIdColumn && <td className="px-4 py-2 text-left">{item._id}</td>}
      <td className="px-4 py-2 text-left">{item.category.name}</td>
      <td className="px-4 py-2 text-left">{item.name}</td>
      <td className="px-4 py-2 text-left">
        {new Date(item.cdate).toLocaleString()}
      </td>
      <td className="px-4 py-2 text-left text-gray-600 font-bold">
        {item.price.toLocaleString()}
      </td>
      <td className="px-4 py-2 text-left">
        <button
          onClick={(e) => handleAddSpecificationClick(e, item)}
          className="text-gray-700 hover:underline border rounded-lg bg-gray-200 p-2"
        >
          Parameters
        </button>
      </td>
    </tr>
  ));

  const Pagination = ({ curPage, totalPages, onPageChange }) => {
    const handleFirstPage = () => onPageChange(1);
    const handleLastPage = () => onPageChange(totalPages);
    const handlePreviousPage = () => onPageChange(Math.max(curPage - 1, 1));
    const handleNextPage = () =>
      onPageChange(Math.min(curPage + 1, totalPages));

    return (
      <div className="flex items-center justify-end space-x-2 mr-4 mt-4">
        <span className="text-black mr-2">
          Page {curPage} of {totalPages}
        </span>
        <button onClick={handleFirstPage} className="border p-1 text-sm">
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button onClick={handlePreviousPage} className="border p-1 text-sm">
          <i className="fas fa-angle-left"></i>
        </button>
        <button onClick={handleNextPage} className="border p-1 text-sm">
          <i className="fas fa-angle-right"></i>
        </button>
        <button onClick={handleLastPage} className="border p-1 text-sm">
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto p-4 relative">
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

      <h2 className="text-3xl font-bold text-left mb-2 text-gray-700">
        PRODUCT LIST
      </h2>

      <div className="flex items-center space-x-4 flex-wrap p-2 justify-end">
        <input
          type="text"
          placeholder="Filter by keyword..."
          value={filter}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 mr-2 focus:ring-2 focus:ring-gray-500"
        />
        <button onClick={() => setShowIdColumn(!showIdColumn)}>
          <i
            className={`fas fa-${
              showIdColumn ? "eye-slash" : "eye"
            } text-gray-500`}
            title={showIdColumn ? "Hide ID" : "Show ID"}
          ></i>
        </button>
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-gray-500"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="border rounded-md p-2 focus:ring-2 focus:ring-gray-500"
        >
          <option value="">Sort</option>
          <option value="price_asc">Price (Ascending)</option>
          <option value="price_desc">Price (Descending)</option>
          <option value="name_asc">A-Z</option>
          <option value="name_desc">Z-A</option>
        </select>

        <button
          onClick={handleAddProductClick}
          className="bg-white text-black px-4 py-2 border rounded-md hover:bg-gray-200"
        >
          + New Product
        </button>
      </div>

      <div
        className="rounded-lg border"
        style={{ maxHeight: "470px", overflowY: "auto", overflowX: "auto" }}
      >
        <table className="min-w-full bg-white">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="px-4 py-2 border-b pr-20">Image</th>
              {showIdColumn && (
                <th className="px-4 py-2 border-b text-left">ID</th>
              )}
              <th className="px-4 py-2 border-b text-left">Category</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Creation date</th>
              <th className="px-4 py-2 border-b text-left">Price</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>{renderProducts}</tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Pagination
          curPage={curPage}
          totalPages={productsData?.noPages || 0}
          onPageChange={handlePageClick}
        />
      </div>

      {showDetail && (
        <ProductDetail
          item={itemSelected}
          onClose={() => setShowDetail(false)}
          updateProducts={handleUpdateProducts}
        />
      )}
    </div>
  );
};

export default Product;
