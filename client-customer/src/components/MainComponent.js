import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Form/HomeComponent";
import Product from "./Product/ProductComponent";
import ProductDetail from "./Product/ProductDetailComponent";
import Signup from "./Account/SignupComponent";
import Login from "./Account/LoginComponent";
import Header from "./Form/HeaderComponent";
import Footer from "./Form/FooterComponent";
import Myprofile from "./Account/MyprofileComponent";
import Mycart from "./Account/MycartComponent";
import Myorders from "./Account/MyordersComponent";
import ResetPassword from "./Account/PWComponent";
import OrderDetailPage from "./Account/OrderDetailPage";
import CheckoutPage from "./Account/CheckoutComponent";

function Main() {
  const [txtKeyword, setTxtKeyword] = useState("");
  const location = useLocation();

  const hideMenuPaths = [
    "/login",
    "/signup",
    "/resetpassword",
    "/myprofile",
    "/mycart",
    "/myorders",
    "/order",
  ];

  const shouldHideMenu = hideMenuPaths.some(
    (path) =>
      location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

  // Kiểm tra xem đường dẫn hiện tại có phải là trang chủ không
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        txtKeyword={txtKeyword}
        setTxtKeyword={setTxtKeyword}
        shouldHideMenu={shouldHideMenu}
      />

      {/* Thêm padding-top tùy thuộc vào trang */}
      <div
        className={
          isHomePage
            ? "pt-[70px]"
            : "pt-[120px] md:pt-[160px] lg:pt-[160px] xl:pt-[90px]"
        }
        style={{ flexGrow: 1 }}
      >
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/myorders" element={<Myorders />} />
          <Route path="/mycart" element={<Mycart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/myprofile" element={<Myprofile />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/category/:cid" element={<Product />} />
          <Route path="/product/search/:keyword" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/order/:orderId" element={<OrderDetailPage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default Main;
