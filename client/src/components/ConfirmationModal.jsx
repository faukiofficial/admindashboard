import { FaSpinner } from "react-icons/fa";

const ConfirmationModal = ({
  title,
  message,
  selected,
  cancel,
  confirm,
  loading,
  buttonColor,
  buttonText,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-6">
          <p className="mr-1">{message}?</p>
          <span className="font-semibold">{selected}</span>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={cancel}
            className="bg-gray-300 hover:bg-gray-400 min-w-[100px] text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={loading}
            className={` text-white min-w-[100px] px-4 py-2 rounded ${
              loading ? "bg-gray-400 cursor-not-allowed" : buttonColor
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
