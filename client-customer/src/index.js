import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Tạo một QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cấu hình mặc định cho các query
      staleTime: 1000 * 60 * 5, // Dữ liệu sẽ coi là mới trong 5 phút
      cacheTime: 1000 * 60 * 10, // Dữ liệu sẽ được lưu trong cache trong 10 phút
      refetchOnWindowFocus: false, // Không tự động lấy dữ liệu khi chuyển lại tab
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
