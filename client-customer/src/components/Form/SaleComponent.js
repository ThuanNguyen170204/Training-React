import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const fetchHotProducts = async () => {
  const response = await axios.get(`/api/customer/products/hot`);
  return response.data;
};

function HotSale({ renderProductItem }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const hotScrollRef = useRef(null);

  const {
    data: hotProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotProducts"],
    queryFn: fetchHotProducts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  // Auto scroll effect
  useEffect(() => {
    if (!hotProducts || hotProducts.length === 0) return;
    const scrollContainer = hotScrollRef.current;
    if (!scrollContainer) return;

    const startAutoScroll = () => {
      let scrollStep = 1;
      const interval = setInterval(() => {
        scrollContainer.scrollLeft += scrollStep;
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }, 20);
      return interval;
    };

    const timeout = setTimeout(() => {
      const intervalId = startAutoScroll();
      return () => clearInterval(intervalId);
    }, 500);

    return () => clearTimeout(timeout);
  }, [hotProducts]);

  // Countdown timer logic
  useEffect(() => {
    const getTimeRemaining = (endTime) => {
      const total = Date.parse(endTime) - Date.now();
      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      return { total, hours, minutes, seconds };
    };

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 5); // 5 tiếng

    const intervalId = setInterval(() => {
      const { total, hours, minutes, seconds } = getTimeRemaining(deadline);
      if (total <= 0) {
        clearInterval(intervalId);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container mx-auto flex flex-col mt-4 px-4">
      <div className="bg-red-500 p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-white text-3xl font-bold flex items-center animate-pulse">
            <i className="fas fa-fire mr-2 text-yellow-300"></i>
            HOT SALE CUỐI TUẦN
          </h1>

          {/* Countdown Timer */}
          <div className="flex">
            <div className="flex  items-center space-x-2 bg-red-500 rounded  px-3 py-1  text-white font-bold">
              <span className="text-lg">Kết thúc sau:</span>
            </div>
            <div className="flex items-center space-x-2 bg-red-500 rounded border px-3 py-1 shadow text-white font-bold animate-pulse">
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm min-w-[32px] text-center ">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              :
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm min-w-[32px] text-center">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              :
              <div className="bg-red-500 text-white px-2 py-1 rounded text-sm min-w-[32px] text-center">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Hot products */}
        <div className="mt-4">
          {isLoading ? (
            <p className="text-white">Đang tải sản phẩm hot...</p>
          ) : error ? (
            <p className="text-yellow-200">Lỗi khi tải sản phẩm hot.</p>
          ) : (
            <div
              ref={hotScrollRef}
              className="flex space-x-4 overflow-x-auto py-2 scrollbar-hide"
            >
              {hotProducts.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[220px] max-w-[220px]  shrink-0"
                >
                  {renderProductItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotSale;
