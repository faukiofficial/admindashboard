import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Select from "react-select";

const Pagination = ({
  handleLimitChange,
  limit,
  handlePrevPage,
  handleNextPage,
  currentPage,
  totalPages,
}) => {
  const limitOptions = [
    { value: 10, label: "10 / page" },
    { value: 25, label: "25 / page" },
    { value: 50, label: "50 / page" },
    { value: 100, label: "100 / page" },
  ];

  // Custom styles for React Select
  const customStyles = {
    control: (base, state) => ({
      ...base,
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
    placeholder: (base) => ({
      ...base,
      color: "#000",
    }),
  };

  return (
    <div className="flex justify-end items-center">
      <div className="mr-4">
        <Select
          name="category"
          options={limitOptions}
          value={limitOptions.find((lim) => lim.value === limit)}
          onChange={handleLimitChange}
          placeholder={limit + " / page"}
          styles={customStyles}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      <button
        onClick={handlePrevPage}
        disabled={currentPage <= 1}
        className={`px-4 py-2 rounded-lg border ${
          currentPage <= 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        <FaArrowLeft />
      </button>
      <span className="mx-4">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded-lg border ${
          currentPage >= totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
