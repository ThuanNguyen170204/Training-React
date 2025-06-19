import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import HotSale from "./SaleComponent.js";
import QC from "./QcComponent";
import Menu from "./MenuComponent.js";

// Hàm fetch mới để lấy tất cả danh mục và sản phẩm của chúng
const fetchCategoriesWithProducts = async () => {
  const url = "/api/customer/categories-with-products"; // Endpoint mới của bạn
  const { data } = await axios.get(url);
  return data;
};

function Home() {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const {
    data: categoriesWithProducts = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categoriesWithProducts"],
    queryFn: fetchCategoriesWithProducts,
  });

  const renderProductItem = (item) => (
    <div
      key={item._id}
      className="bg-white rounded-lg shadow-md border p-2 flex flex-col w-full h-full transition-transform transform relative"
    >
      {item.discount > 0 && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-tl-lg rounded-br-lg">
          Giảm {item.discount}%
        </div>
      )}

      <Link to={"/product/" + item._id} className="p-2">
        <img
          src={"data:image/jpg;base64," + item.image}
          alt={item.name}
          className="object-contain w-27 h-25 mx-auto rounded-lg"
        />
      </Link>

      <p className="text-xs sm:text-sm font-bold mb-1 text-left text-gray-600 line-clamp-2 min-h-[2.5em]">
        {item.name}
      </p>

      <div>
        {item.discount > 0 ? (
          <span className="text-red-600 text-sm font-bold">
            {item.discountedPrice.toLocaleString("vi-VN") + "đ"}
          </span>
        ) : (
          <span className="text-red-600 text-sm font-bold">
            {item.price.toLocaleString("vi-VN") + "đ"}
          </span>
        )}

        <span className="text-gray-500 text-xs font-bold line-through ml-1">
          {item.price.toLocaleString("vi-VN") + "đ"}
        </span>
      </div>

      <p className="text-gray-500 font-bold text-xs mb-1">
        Thành viên giảm thêm đến
        <span className="text-red-600 font-bold ml-1">307.000đ</span>
      </p>

      <p className="text-gray-500 text-xs mb-1 border-2 rounded-md bg-gray-100">
        Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6...
      </p>

      <div className="flex items-center text-xs mb-2">
        <div className="flex justify-start text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <i key={index} className="fas fa-star"></i>
          ))}
        </div>
      </div>
    </div>
  );

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="mx-auto pt-10 md:pt-4 pb-4 max-w-6xl">
      <div className="hidden lg:block">
        <Menu />
      </div>
      <QC />
      {/*------------------------------------*/}
      <HotSale renderProductItem={renderProductItem} />
      <div className="mx-auto mt-10 px-4">
        {categoriesWithProducts.map((catData) => {
          const categoryId = catData.category._id;
          const isExpanded = expandedCategories.includes(categoryId);
          const productsToShow = isExpanded
            ? catData.products
            : catData.products.slice(0, 5);

          return (
            <div key={categoryId} className="mx-auto mt-10 max-w-7xl">
              <div className="relative text-center mb-6">
                <h2 className="text-3xl font-bold text-red-700 pb-2 bg-white px-2 inline-block relative z-10">
                  {catData.category.name}
                </h2>
                <div className="absolute inset-x-0 top-1/2 border-b-2 border-red-600 z-0"></div>
              </div>

              {productsToShow.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 ">
                    {productsToShow.map(renderProductItem)}
                  </div>
                  {catData.products.length > 5 && (
                    <div className="text-center mt-2">
                      <button
                        onClick={() => toggleCategory(categoryId)}
                        className="border rounded-md shadow-md pr-4 pl-4 hover:text-blue-800"
                      >
                        {isExpanded
                          ? "Ẩn bớt"
                          : `Xem thêm ${catData.products.length - 5} sản phẩm`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-600">
                  Không có sản phẩm nào trong danh mục này.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
