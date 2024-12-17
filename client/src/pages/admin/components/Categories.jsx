import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegSadTear, FaSpinner } from "react-icons/fa";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../../../redux/category/categorySlice";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ConfirmationModal from "../../../components/ConfirmationModal";

const Categories = () => {
  const [categoryData, setCategoryData] = useState({ name: "", code: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    categories,
    getAllCategoriesLoading,
    updateCategoryLoading,
    addCategoryLoading,
    deleteCategoryLoading,
  } = useSelector((state) => state.category);

  const getCategory = useCallback(
    async (id) => {
      const resultAction = await dispatch(getSingleCategory(id));

      if (resultAction.meta.requestStatus === "fulfilled") {
        const category = resultAction.payload.category;
        setCategoryData({ name: category.name, code: category.code });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getAllCategories());
    }
    if (id) {
      getCategory(id);
    }
  }, [dispatch, getCategory, id, categories.length]);

  const handleClickEdit = (id) => {
    navigate(`/admin/categories/${id}`);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (id) {
      const categoryDataSent = {
        name: categoryData.name,
        code: categoryData.code,
      };
      const resultAction = await dispatch(
        updateCategory({ data: categoryDataSent, id })
      );

      if (resultAction.meta.requestStatus === "fulfilled") {
        setCategoryData({ name: "", code: "" });
        navigate("/admin/categories");
      }
    } else {
      const resultAction = await dispatch(addCategory(categoryData));

      if (resultAction.meta.requestStatus === "fulfilled") {
        setCategoryData({ name: "", code: "" });
      }
    }
  };

  const handleOpenDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    const resultAction = await dispatch(deleteCategory(selectedCategory._id));

    if (resultAction.meta.requestStatus === "fulfilled") {
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-6 bg-white w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Categories
        </h1>
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg border">
          <table className="w-full border-collapse">
            <thead className="bg-green-100">
              <tr>
                <th className="p-4 text-left text-gray-700">#</th>
                <th className="p-4 text-left text-gray-700">Name</th>
                <th className="p-4 text-left text-gray-700">Code</th>
                <th className="p-4 text-left text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {getAllCategoriesLoading && !categories ? (
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
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-600">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <FaRegSadTear className="mr-2 text-[100px] text-red-600" />
                      <h1 className="text-xl font-semibold">
                        No category found
                      </h1>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } border-b`}
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      {category.name}{" "}
                      {category._id === id && (
                        <span className="bg-green-600 p-1 px-2 text-white rounded-full font-semibold text-sm">
                          ON EDIT
                        </span>
                      )}
                    </td>
                    <td className="p-4">{category.code}</td>
                    <td className="p-4 flex items-center gap-2">
                      <span
                        onClick={() => handleClickEdit(category._id)}
                        className="text-green-600 hover:underline cursor-pointer"
                      >
                        Edit
                      </span>
                      <span
                        onClick={() => handleOpenDeleteModal(category)}
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
      </div>

      {/* Add Category */}
      <div className="mt-12 pt-5 border-t border-gray-300">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {id ? "Edit Category" : "Add Category"}
          </h2>
          {id && (
            <div
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded w-fit cursor-pointer"
              onClick={() => {
                navigate("/admin/categories");
                setCategoryData({ name: "", code: "" });
              }}
            >
              Add New
            </div>
          )}
        </div>
        <form
          onSubmit={handleCategorySubmit}
          className="space-y-6 max-w-[900px] mx-auto"
        >
          <div>
            {id && (
              <div className="bg-green-600 p-1 px-2 text-white rounded-full font-semibold text-sm w-fit mb-4">
                Edit Mode
              </div>
            )}
            <label className="block font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={categoryData.name}
              onChange={handleCategoryInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Category Code
            </label>
            <input
              type="text"
              name="code"
              value={categoryData.code}
              onChange={handleCategoryInputChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded ${
              addCategoryLoading || updateCategoryLoading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {addCategoryLoading || updateCategoryLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : id ? (
              "Update Category"
            ) : (
              "Add Category"
            )}
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <ConfirmationModal
          title="Delete Category"
          message="Delete this category"
          selected={selectedCategory.name}
          cancel={() => setDeleteModalOpen(false)}
          confirm={handleDeleteCategory}
          loading={deleteCategoryLoading}
          buttonColor={"bg-red-500 hover:bg-red-600"}
          buttonText={"Delete"}
        />
      )}
    </div>
  );
};

export default Categories;
