import { useNavigate } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteProduct,
  getAllProducts,
} from "../../../redux/product/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaRegSadTear, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Select from "react-select"; // Import react-select
import { getAllCategories } from "../../../redux/category/categorySlice";
import ConfirmationModal from "../../../components/ConfirmationModal";
import Pagination from "../../../components/Paginations";

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    getAllProductsLoading,
    products,
    totalProducts,
    currentPage,
    totalPages,
    deleteProductLoading,
  } = useSelector((state) => state.product);

  const { getAllCategoriesLoading, categories } = useSelector(
    (state) => state.category
  );

  const [page, setPage] = useState(
    localStorage.getItem("page") || currentPage || 1
  );
  const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryTemp, setSearchQueryTemp] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [sorting, setSorting] = useState({
    sortField: "updatedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    const { sortField, sortOrder } = sorting;
    dispatch(
      getAllProducts({
        sortField,
        sortOrder,
        category: categoryFilter,
        name: searchQuery.trim(),
        limit,
        page,
      })
    );
  }, [sorting, dispatch, searchQuery, limit, page, categoryFilter]);

  // Search
  const handleSearch = () => {
    if (searchQueryTemp !== searchQuery) {
      setSearchQuery(searchQueryTemp);
    }
  };
  // End Search

  // Category
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleSelectCategory = (selectedOption) => {
    const selectedCategory = selectedOption ? selectedOption.value : "";
    setCategoryFilter(selectedCategory);
    setPage(1);
    localStorage.setItem("page", 1);
  };

  const categoriesOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];
  // End Category

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

  // Edit
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };
  // End Edit

  // Delete
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct) {
      const resultAction = await dispatch(deleteProduct(selectedProduct._id));

      if (resultAction.meta.requestStatus === "fulfilled") {
        setIsModalOpen(false);
        setSelectedProduct(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  // End Delete

  // Pagination
  const handleNextPage = () => {
    setPage(Number(page) + 1);
    localStorage.setItem("page", Number(page) + 1);
  };

  const handlePrevPage = () => {
    setPage(Number(page) - 1);
    localStorage.setItem("page", Number(page) - 1);
  };

  const handleLimitChange = (selectedLimit) => {
    setLimit(selectedLimit.value);
    localStorage.setItem("limit", selectedLimit.value);
  };
  // End Pagination

  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      width: "250px",
      height: "50px",
      borderColor: state.isFocused ? "#16a34a" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 2px #bbf7d0" : "none",
      "&:hover": {
        borderColor: "#16a34a",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#16a34a"
        : state.isFocused
        ? "#bbf7d0"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
    }),
  };
  // End Custom styles

  return (
    <div className="p-6 bg-white w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Add Product
        </button>
      </div>
      <div className="mb-6">
        <div className="flex justify-between">
          <div className="flex">
            <input
              type="text"
              name="name"
              placeholder="Search by name"
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
          <Select
            name="category"
            options={categoriesOptions}
            value={categoriesOptions.find(
              (category) => category.value === categoryFilter
            )}
            onChange={handleSelectCategory}
            placeholder="Select Category"
            styles={customStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
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
                  sorting.sortField === "price" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-between">
                  Price
                  {sorting.sortField === "price" ? (
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
                  sorting.sortField === "category" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center justify-between">
                  Category
                  {sorting.sortField === "category" ? (
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
                  sorting.sortField === "code" ? "bg-green-200" : ""
                }`}
                onClick={() => handleSort("code")}
              >
                <div className="flex items-center justify-between">
                  Code
                  {sorting.sortField === "code" ? (
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
            {getAllProductsLoading || getAllCategoriesLoading ? (
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
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FaRegSadTear className="mr-2 text-[100px] text-red-600" />
                    <h1 className="text-xl font-semibold">No products found</h1>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b`}
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">
                    Rp. {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">{product.category.name}</td>
                  <td className="p-4">{product.code}</td>
                  <td className="p-4">{formatDate(product.createdAt)}</td>
                  <td className="p-4">{formatDate(product.updatedAt)}</td>
                  <td className="p-4 flex items-center gap-2">
                    <span
                      onClick={() => handleEdit(product._id)}
                      className="text-green-600 hover:underline cursor-pointer"
                    >
                      Edit
                    </span>
                    <span
                      onClick={() => handleDelete(product)}
                      className="text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-700 p-2 border rounded-md text-sm">{`Showing ${products.length} of ${totalProducts} products`}</span>
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

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <ConfirmationModal
          title="Delete Confirmation"
          message={`Are you sure you want to delete`}
          selected={selectedProduct.name}
          cancel={cancelDelete}
          confirm={confirmDelete}
          loading={deleteProductLoading}
          buttonColor="bg-red-500 hover:bg-red-600"
          buttonText="Delete"
        />
      )}
    </div>
  );
};

export default AllProducts;
