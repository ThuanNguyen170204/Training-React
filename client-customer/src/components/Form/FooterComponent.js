import React from "react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-gray-800 text-white">
      <div className="bg-gray-800 border-b-2  py-8">
        <div className="container mx-auto flex justify-around text-center">
          <div>
            <i className="fas fa-check-circle text-4xl mb-2"></i>
            <p>Mẫu mã đa dạng, chính hãng</p>
          </div>
          <div>
            <i className="fas fa-truck text-4xl mb-2"></i>
            <p>Giao hàng toàn quốc</p>
          </div>
          <div>
            <i className="fas fa-shield-alt text-4xl mb-2"></i>
            <p>Bảo hành có cam kết tới 12 tháng</p>
          </div>
        </div>
      </div>
      <div className="bg-custom-blue py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Link to="/home">
                <img
                  alt=""
                  className="mr-2"
                  height="50"
                  src="images/Logo/Logo-1.png"
                  width="100"
                />
              </Link>
              <Link to="/home">
                <img
                  alt="Apple Premium Reseller logo"
                  height="50"
                  src="https://storage.googleapis.com/a1aa/image/eNKNdt52SgSKH7vqm6A4_OVjOgO6UjCdkcMhsxIWvNs.jpg"
                  width="50"
                />
              </Link>
            </div>
            <div className="mb-4">
              <h3 className="font-bold">Tổng đài</h3>
              <p>
                Mua hàng: <span className="text-blue-500">1900.9696.42</span>{" "}
                (8:00 - 21:30)
              </p>
              <p>
                Kiếu nại: <span className="text-blue-500">1900.9868.43</span>{" "}
                (8:00 - 21:30)
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              <i className="fab fa-facebook-square text-3xl"></i>
              <i className="fab fa-youtube text-3xl"></i>
              <i className="fab fa-zalo text-3xl"></i>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Hỗ trợ khách hàng</h3>
            <ul>
              <li>Điều kiện giao dịch chung</li>
              <li>Hướng dẫn mua hàng online</li>
              <li>Chính sách giao hàng</li>
              <li>Hướng dẫn thanh toán</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Về thương hiệu</h3>
            <ul>
              <li className="text-blue-500">Tích điểm Quà tặng VIP</li>
              <li>Giới thiệu</li>
              <li>Bán hàng doanh nghiệp</li>
              <li>Chính sách xử lý dữ liệu cá nhân</li>
              <li>Xem bản mobile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
