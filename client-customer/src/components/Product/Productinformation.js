import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import withRouter from "../../utils/withRouter";

const fetchDescriptions = async (productId) => {
  const response = await axios.get(
    `/api/customer/product-descriptions/${productId}`
  );
  return response.data;
};

function ProductInfor(props) {
  const params = props.params;
  const {
    data: descriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["descriptions", params.id],
    queryFn: () => fetchDescriptions(params.id),
    enabled: !!params.id,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  const descriptionArray = Array.isArray(descriptions)
    ? descriptions
    : [descriptions].filter(Boolean);
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Thông số kỹ thuật
          </h2>
        </div>
        <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
          {descriptionArray.map((item) => (
            <div key={item._id}>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center">
                <div className="text-gray-600 text-sm font-medium">
                  Kích thước màn hình
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.screensize}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">
                  Công nghệ màn hình
                </div>
                <div className="col-span-2 sm:col-span-3 text-blue-600 text-sm font-medium">
                  {item.screen_technology}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">Pin</div>
                <div className="col-span-2 sm:col-span-3 text-sm ">
                  {item.pin}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-start">
                <div className="text-gray-600 text-sm font-medium">
                  Camera sau
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm leading-relaxed">
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {item.rear_camera}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">
                  Camera trước
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.front_camera}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center">
                <div className="text-gray-600 text-sm font-medium">Chipset</div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.chip}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">Thẻ SIM</div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.sim_card}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center">
                <div className="text-gray-600 text-sm font-medium">
                  Hệ điều hành
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.operating_system}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center">
                <div className="text-gray-600 text-sm font-medium">
                  Bộ nhớ trong
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.internal_memory}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">
                  Độ phân giải màn hình
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.screen_resolution}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-start">
                <div className="text-gray-600 text-sm font-medium">
                  Tính năng màn hình
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm leading-relaxed">
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {item.compatible}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-3 items-center bg-gray-50">
                <div className="text-gray-600 text-sm font-medium">
                  Loại CPU
                </div>
                <div className="col-span-2 sm:col-span-3 text-gray-900 text-sm">
                  {item.cpu}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withRouter(ProductInfor);
