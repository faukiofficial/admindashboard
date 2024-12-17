import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addProduct } from "../../../redux/product/productSlice";
import { FaSpinner } from "react-icons/fa";
import Select from "react-select";
import { getAllCategories } from "../../../redux/category/categorySlice";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    code: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addProductLoading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  
  const location = useLocation();

  useEffect(() => {
    document.title = "Add Product | Eduwork Marketplace";
  }, [location]);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const handleCategoryChange = (selectedOption) => {
    setFormData({
      ...formData,
      category: selectedOption ? selectedOption.value : "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(addProduct(formData));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/admin/products");
      setFormData({ name: "", price: "", category: "", code: "" });
    }
  };

  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
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

  return (
    <div className="p-6 bg-white w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Product</h1>
      <form
        onSubmit={handleProductSubmit}
        className="space-y-6 max-w-[900px] mx-auto"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Category
          </label>
          <Select
            options={categoryOptions}
            value={categoryOptions.find(
              (option) => option.value === formData.category
            )}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            isClearable
            styles={customStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Code</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-semibold rounded ${
            addProductLoading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {addProductLoading ? (
            <FaSpinner className="animate-spin mx-auto" />
          ) : (
            "Add Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
