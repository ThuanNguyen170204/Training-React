import React, { useContext } from "react";
import MyContext from "../contexts/MyContext";
import Menu from "./MenuComponent";
import Home from "./HomeComponent";
import { Routes, Route, Navigate } from "react-router-dom";
import Category from "./CategoryComponent";
import Product from "./ProductComponent";
import Order from "./OrderComponent";
import Customer from "./CustomerComponent";
import Header from "./HeaderComponent";
import Description from "./DescriptionProductComponent";
import ProductHotPage from "./ProductHotPage";

const Main = () => {
  const { token } = useContext(MyContext); // Sử dụng useContext để truy cập global state

  if (token !== "") {
    return (
      <div className="flex h-screen ">
        <div className="relative w-128">
          <Menu />
        </div>
        <div className="w-full overflow-auto">
          <Header />
          <div className="flex-grow ">
            <Routes>
              <Route
                path="/admin"
                element={<Navigate replace to="/admin/home" />}
              />
              <Route path="/admin/home" element={<Home />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/product" element={<Product />} />
              <Route path="/admin/order" element={<Order />} />
              <Route path="/admin/customer" element={<Customer />} />
              <Route path="/admin/product-hot" element={<ProductHotPage />} />
              <Route
                path="/admin/product-description/:productId"
                element={<Description />}
              />
            </Routes>
          </div>
        </div>
      </div>
    );
  }
  return <div />;
};

export default Main;
