import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { forgetPassword } from "../../redux/user/userSlice";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {forgetPasswordLoading} = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
    };

    const resultAction = await dispatch(forgetPassword(data));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/auth/reset-password-activation");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address and we will send you a code to reset your password.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-semibold rounded ${
              forgetPasswordLoading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={forgetPasswordLoading}
            onClick={handleSubmit}
          >
            {forgetPasswordLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Send"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/auth/login")}
              className="text-green-600 cursor-pointer hover:underline font-semibold"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
