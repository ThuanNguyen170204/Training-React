import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MyContext from "../contexts/MyContext";

const fetchCustomers = async (token) => {
  const config = { headers: { "x-access-token": token } };
  const response = await axios.get("/api/admin/customers", config);
  return response.data;
};

const Customer = () => {
  const context = useContext(MyContext);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showIdColumn, setShowIdColumn] = useState(false); // State to manage ID column visibility

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchCustomers(context.token),
    enabled: !!context.token,
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleActiveFilterChange = (e) => {
    setActiveFilter(e.target.value);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const matchesFilter = Object.values(customer).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      );
      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && customer.active) ||
        (activeFilter === "inactive" && !customer.active);
      return matchesFilter && matchesActive;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      if (sortOrder === "desc") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="container mx-auto p-4 relative  pb-20">
      <h2 className="text-left font-bold text-3xl text-gray-700 mb-4">
        CUSTOMER LIST
      </h2>
      <div className="flex items-center space-x-4 flex-wrap p-2 justify-end">
        <input
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">Sort by Name</option>
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
        <select
          value={activeFilter}
          onChange={handleActiveFilterChange}
          className="border rounded-lg px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Customers</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={() => setShowIdColumn((prev) => !prev)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showIdColumn ? "Hide ID" : "Show ID"}
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-200 border-b">
          <tr>
            {showIdColumn && <th className="px-4 py-2 text-left">ID</th>}
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Active</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((item) => (
            <tr key={item._id} className="hover:bg-gray-100">
              {showIdColumn && <td className="px-4 py-2">{item._id}</td>}
              <td className="px-4 py-2">{item.username}</td>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.phone}</td>
              <td className="px-4 py-2">{item.email}</td>
              <td className="px-4 py-2">{item.active ? "1" : "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customer;
