import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../redux/order/orderSlice";
import formatDate from "../../../utils/formatDate";
import { FaRegSadTear, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import Pagination from "../../../components/Paginations";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, getAllOrdersLoading, currentPage, totalPages, totalOrders } =
    useSelector((state) => state.order);

  const [page, setPage] = useState(
    localStorage.getItem("page2") || currentPage || 1
  );
  const [limit, setLimit] = useState(localStorage.getItem("limit2") || 10);
  const [sorting, setSorting] = useState({
    sortField: "updatedAt",
    sortOrder: "desc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryTemp, setSearchQueryTemp] = useState("");

  useEffect(() => {
    const { sortField, sortOrder } = sorting;
    dispatch(
      getAllOrders({
        sortField,
        sortOrder,
        name: searchQuery.trim(),
        limit,
        page,
      })
    );
  }, [sorting, dispatch, searchQuery, limit, page]);

  // Search
  const handleSearch = () => {
    if (searchQueryTemp !== searchQuery) {
      setSearchQuery(searchQueryTemp);
    }
  };
  // End Search

  // Sorting
  const handleSort = (field) => {
    setSorting((prevSorting) => {
      const newOrder =
        prevSorting.sortField === field
          ? prevSorting.sortOrder === "asc"
            ? "desc"
            : "asc"
          : "asc";
      return { sortField: field, sortOrder: newOrder };
    });
  };
  // End Sorting

  // Pagination
  const handleNextPage = () => {
    setPage(Number(page) + 1);
    localStorage.setItem("page2", Number(page) + 1);
  };

  const handlePrevPage = () => {
    setPage(Number(page) - 1);
    localStorage.setItem("page2", Number(page) - 1);
  };

  const handleLimitChange = (selectedLimit) => {
    setLimit(selectedLimit.value);
    localStorage.setItem("limit2", selectedLimit.value);
  };
  // End Pagination

  return (
    <div className="p-6 bg-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
      </div>
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="flex">
            <input
              type="text"
              name="name"
              placeholder="Search by product name"
              value={searchQueryTemp}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onChange={(e) => setSearchQueryTemp(e.target.value)}
              className="px-4 py-2 w-[400px] border border-gray-300 rounded-lg rounded-r-none focus:outline-none focus:border-green-600 transition duration-200"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg rounded-l-none transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg border">
        <table className="w-full border-collapse">
          <thead className="bg-green-100">
            <tr>
              <th className="p-4 text-left text-gray-700">#</th>
              <th>
                <div className="flex items-center justify-between">Name</div>
              </th>
              <th
                className={`p-4 text-left text-gray-700 cursor-pointer ${
                  sorting.sortField === "amount" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-between">
                  Amount
                  {sorting.sortField === "amount" ? (
                    sorting.sortOrder === "asc" ? (
                      <FaSortDown />
                    ) : (
                      <FaSortUp />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>

              <th
                className={`p-4 text-left text-gray-700 cursor-pointer ${
                  sorting.sortField === "createdAt" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-between">
                  Created
                  {sorting.sortField === "createdAt" ? (
                    sorting.sortOrder === "asc" ? (
                      <FaSortDown />
                    ) : (
                      <FaSortUp />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>
              <th
                className={`p-4 text-left text-gray-700 cursor-pointer ${
                  sorting.sortField === "updatedAt" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center justify-between">
                  Updated
                  {sorting.sortField === "updatedAt" ? (
                    sorting.sortOrder === "asc" ? (
                      <FaSortDown />
                    ) : (
                      <FaSortUp />
                    )
                  ) : (
                    <FaSort />
                  )}
                </div>
              </th>
              <th className="p-4 text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {getAllOrdersLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b`}
                >
                  <td className="p-4">
                    <Skeleton width={20} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={200} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={100} height={20} />
                  </td>

                  <td className="p-4">
                    <Skeleton width={120} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={120} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={80} height={20} />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 && getAllOrdersLoading ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FaRegSadTear className="mr-2 text-[100px] text-red-600" />
                    <h1 className="text-xl font-semibold">No orders found</h1>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">
                    {order.products.map((product, index) => (
                      <div
                        key={product._id}
                        className={`py-1 ${index === 0 ? "" : "border-t"}`}
                      >
                        <p className="font-semibold">{product.name}</p>
                        <p className="font-sm text-gray-600">
                          Rp. {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="p-4">
                    Rp. {order.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{formatDate(order.createdAt)}</td>
                  <td className="p-4">{formatDate(order.updatedAt)}</td>
                  <td className="p-4 flex items-center gap-2"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-700 p-2 border rounded-md text-sm">{`Showing ${orders.length} of ${totalOrders} orders`}</span>
        {/* Pagination */}
        <Pagination
          handleLimitChange={handleLimitChange}
          limit={limit}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AllOrders;
