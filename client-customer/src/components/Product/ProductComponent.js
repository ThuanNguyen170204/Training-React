import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import withRouter from "../../utils/withRouter";

const fetchProducts = async (params) => {
  const url = params.cid
    ? `/api/customer/products/category/${params.cid}`
    : `/api/customer/products/search/${params.keyword}`;
  const { data } = await axios.get(url);
  return data;
};

function Product(props) {
  const params = props.params;
  const [sortOption, setSortOption] = useState("default");

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    enabled: !!params.cid || !!params.keyword,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const filteredProducts = [...products]
    .filter((item) => {
      if (sortOption === "discount") return item.discount > 0;
      return true;
    })
    .sort((a, b) => {
      const priceA = a.discount > 0 ? a.discountedPrice : a.price;
      const priceB = b.discount > 0 ? b.discountedPrice : b.price;

      if (sortOption === "price-asc") {
        return priceA - priceB;
      } else if (sortOption === "price-desc") {
        return priceB - priceA;
      }
      return 0;
    });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="mx-auto px-4 pb-4 max-w-6xl">
      {/* Bộ lọc */}
      <div className="flex flex-row space-x-2 sm:flex-row sm:items-center sm:space-x-2 pb-4 font-bold">
        <button
          className={`flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-500 hover:bg-gray-200 ${
            sortOption === "price-asc"
              ? "bg-red-50 text-red-600 border-red-500"
              : ""
          }`}
          onClick={() => setSortOption("price-asc")}
        >
          <i class="fas fa-sort-amount-up"></i>
          Giá tăng dần
        </button>
        <button
          className={`flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-500 hover:bg-gray-200 ${
            sortOption === "price-desc"
              ? "bg-red-50 text-red-600 border-red-500"
              : ""
          }`}
          onClick={() => setSortOption("price-desc")}
        >
          <i class="fas fa-sort-amount-down"></i>
          Giá giảm dần
        </button>
        <button
          className={`flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 ${
            sortOption === "discount"
              ? "bg-red-50 text-red-600 border-red-500"
              : ""
          }`}
          onClick={() => setSortOption("discount")}
        >
          <span class="text-xs font-semibold">%</span>
          Khuyến mãi
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5">
        {filteredProducts.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md border p-2 flex flex-col max-w-xs transition-transform transform"
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

            <p className="text-black text-xs mb-1">
              Smember giảm thêm đến
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
        ))}
      </div>
    </div>
  );
}

export default withRouter(Product);
