import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MyContext from "../contexts/MyContext";

const fetchOrders = async (token) => {
  const config = { headers: { "x-access-token": token } };
  const response = await axios.get("/api/admin/orders", config);
  return response.data;
};

const Order = () => {
  const context = useContext(MyContext);
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const itemsPerPage = 10;
  const lowerSearch = searchTerm.toLowerCase();
  const [notification, setNotification] = useState({ message: "", type: "" });

  const {
    data: orders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders(context.token),
    enabled: !!context.token,
  });

  const handleItemClick = (item) => {
    setSelectedOrder(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const config = { headers: { "x-access-token": context.token } };
      await axios.put(`/api/admin/orders/${orderId}/confirm`, {}, config);
      setNotification({
        message: "Order confirmed successfully.",
        type: "success",
      });
      queryClient.invalidateQueries(["orders"]);
      closeModal();
    } catch (err) {
      console.error("Error confirming order:", err);
      setNotification({ message: "Error confirming order.", type: "error" });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.receiver?.name.toLowerCase().includes(lowerSearch) ||
      order.receiver?.phone.toLowerCase().includes(lowerSearch);
    const matchesFilter =
      filterCriteria === "all" ||
      (filterCriteria === "high" && order.total > 100) ||
      (filterCriteria === "low" && order.total <= 100);

    const orderDate = new Date(order.cdate);
    const isWithinDateRange =
      (!startDate || orderDate >= new Date(startDate)) &&
      (!endDate || orderDate <= new Date(endDate));

    return matchesSearch && matchesFilter && isWithinDateRange;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (curPage - 1) * itemsPerPage,
    curPage * itemsPerPage
  );

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error fetching orders: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
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

      <h2 className="text-3xl font-bold text-left text-gray-700 mb-4">
        ORDER LIST
      </h2>
      <div className="mb-4 flex justify-end space-x-4">
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1"
        />
        <select
          value={filterCriteria}
          onChange={(e) => setFilterCriteria(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1"
        >
          <option value="all">All Orders</option>
          <option value="high">Total over 100</option>
          <option value="low">Total ≤ 100</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2 border-b">Address</th>
              <th className="px-4 py-2 border-b text-left">Creation date</th>
              <th className="px-4 py-2 border-b text-left">Cust.name</th>
              <th className="px-4 py-2 border-b text-left">Cust.phone</th>
              <th className="px-4 py-2 border-b text-left">Total</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-100 cursor-pointer transition duration-200"
                onClick={() => handleItemClick(item)}
              >
                <td className="px-4 py-2 border-b">{item.receiver.address}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(item.cdate).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">
                  {item.customer ? item.receiver.name : "N/A"}
                </td>
                <td className="px-4 py-2 border-b">
                  {item.customer ? item.receiver.phone : "N/A"}
                </td>
                <td className="px-4 py-2 border-b">{item.total}</td>
                <td className="px-4 py-2 text-center border-b">
                  <p
                    className={`border rounded-xl p-1 ${
                      item.status === "PENDING"
                        ? "bg-gray-200 text-gray-700 font-semibold text-sm"
                        : item.status === "APPROVED"
                        ? "bg-green-200 text-green-600 font-semibold text-sm"
                        : "bg-red-300 "
                    }`}
                  >
                    {item.status}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurPage((prev) => Math.max(prev - 1, 1))}
          disabled={curPage === 1}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {curPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={curPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 min-w-350 w-full max-w-4xl">
            {/* Nút X đóng ở góc trên bên phải */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">
              ORDER DETAIL
            </h2>

            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 border-b">No.</th>
                    <th className="px-4 py-2 border-b">Prod.ID</th>
                    <th className="px-4 py-2 border-b">Prod.name</th>
                    <th className="px-4 py-2 border-b">Image</th>
                    <th className="px-4 py-2 border-b">Price</th>
                    <th className="px-4 py-2 border-b">Quantity</th>
                    <th className="px-4 py-2 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={item.product._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b text-center">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {item.product._id}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        <img
                          src={`data:image/jpg;base64,${item.product.image}`}
                          width="70"
                          height="70"
                          alt={item.product.name}
                          className="object-cover mx-auto"
                        />
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {item.product.price}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 border-b text-center">
                        {item.product.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-4 mt-6">
              {selectedOrder.status === "PENDING" && (
                <button
                  onClick={() => handleConfirmOrder(selectedOrder._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Approve Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
