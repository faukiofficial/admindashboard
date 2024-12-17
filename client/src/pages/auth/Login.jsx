import { useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loginLoading } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser(formData));

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/admin/products");
      setFormData({ email: "", password: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
            <div
              className="absolute top-9 right-3 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full py-2 px-4 text-white font-semibold rounded ${
              loginLoading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loginLoading ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            <Link
              to="/auth/forget-password"
              className="text-green-500 hover:underline"
            >
              Forget Password?
            </Link>
          </p>
          <p className="mt-2">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-green-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
