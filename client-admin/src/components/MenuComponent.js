import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="flex flex-col h-full pt-10 border rounded-lg bg-gray-200 shadow-lg p-2 w-10 sm:w-32 md:w-32 lg:w-48">
      <div className="flex justify-center items-center pb-6">
        <img
          alt="Logo"
          className="h-15 md:h-20  " // Điều chỉnh chiều cao cho các kích thước khác nhau
          src="images/LogoThuongHieu.png?v=1"
          width="70"
          height="auto" // Sử dụng auto để chiều cao tự động điều chỉnh theo tỷ lệ
        />
      </div>

      <nav className="flex flex-col sm:items-center">
        <Link
          to="/admin/home"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <span className="fa fa-home"></span>
          <span className="ml-2 hidden sm:block">Home</span>
        </Link>
        <Link
          to="/admin/category"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <i className="fa fa-bars" aria-hidden="true"></i>
          <span className="ml-2 hidden sm:block">Category</span>
        </Link>
        <Link
          to="/admin/product"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          <span className="ml-2 hidden sm:block">Product</span>
        </Link>
        <Link
          to="/admin/order"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <i className="fa fa-shopping-cart" aria-hidden="true"></i>
          <span className="ml-2 hidden sm:block">Order</span>
        </Link>
        <Link
          to="/admin/customer"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <i className="fa fa-user" aria-hidden="true"></i>
          <span className="ml-2 hidden sm:block">Customer</span>
        </Link>
        <Link
          to="/admin/product-hot"
          className="flex items-center pb-4 rounded w-full justify-center sm:justify-start"
        >
          <i className="fa fa-fire text-red-500" aria-hidden="true"></i>
          <span className="ml-2 hidden sm:block">Product Hot</span>
        </Link>
      </nav>

      <h2 className="mt-6 mb-2 text-lg font-semibold"></h2>
    </div>
  );
};

export default Menu;
