import formatDate from "../../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "../../../components/Paginations";
import { getAllUsers } from "../../../redux/user/userSlice";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { getAllUsersLoading, users, totalUsers, currentPage, totalPages } =
    useSelector((state) => state.user);

  const [page, setPage] = useState(
    localStorage.getItem("page3") || currentPage || 1
  );
  const [limit, setLimit] = useState(localStorage.getItem("limit3") || 10);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryTemp, setSearchQueryTemp] = useState("");

  const [sorting, setSorting] = useState({
    sortField: "updatedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    const { sortField, sortOrder } = sorting;
    dispatch(
      getAllUsers({
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
    localStorage.setItem("page3", Number(page) + 1);
  };

  const handlePrevPage = () => {
    setPage(Number(page) - 1);
    localStorage.setItem("page3", Number(page) - 1);
  };

  const handleLimitChange = (selectedLimit) => {
    setLimit(selectedLimit.value);
    localStorage.setItem("limit3", selectedLimit.value);
  };
  // End Pagination

  return (
    <div className="p-6 bg-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
      </div>
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="flex">
            <input
              type="text"
              name="name"
              placeholder="Search by name or email"
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
              <th
                className={`p-4 text-left text-gray-700 cursor-pointer ${
                  sorting.sortField === "name" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center justify-between">
                  Name
                  {sorting.sortField === "name" ? (
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
                  sorting.sortField === "email" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center justify-between">
                  Email
                  {sorting.sortField === "email" ? (
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
                  sorting.sortField === "phone_number" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("phone_number")}
              >
                <div className="flex items-center justify-between">
                  Phone Number
                  {sorting.sortField === "phone_number" ? (
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
                  sorting.sortField === "address" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("address")}
              >
                <div className="flex items-center justify-between">
                  Address
                  {sorting.sortField === "address" ? (
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
            {getAllUsersLoading ? (
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
                    <Skeleton width={100} height={20} />
                  </td>
                  <td className="p-4">
                    <Skeleton width={80} height={20} />
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FaRegSadTear className="mr-2 text-[100px] text-red-600" />
                    <h1 className="text-xl font-semibold">No users found</h1>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone_number}</td>
                  <td className="p-4">{user.address ? user.address : "-"}</td>
                  <td className="p-4">{formatDate(user.createdAt)}</td>
                  <td className="p-4">{formatDate(user.updatedAt)}</td>
                  <td className="p-4 flex items-center gap-2"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-700 p-2 border rounded-md text-sm">{`Showing ${users.length} of ${totalUsers} products`}</span>
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

export default AllUsers;
