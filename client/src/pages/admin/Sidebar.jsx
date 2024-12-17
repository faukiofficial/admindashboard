import {
  FaList,
  FaPlus,
  FaShoppingCart,
  FaSignOutAlt,
  FaSpinner,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/user/userSlice";

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logoutLoading } = useSelector((state) => state.user);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/auth/login")
    }
  };

  const getUserTwoFirstWordInitial = () => {
    if (user?.name) {
      const words = user?.name.split(" ");
      const firstWordInitial = words[0][0];
      if (words.length > 1) {
        const secondWordInitial = words[1][0];
        const initial = firstWordInitial + secondWordInitial;
        return initial;
      }
    }
  };

  const getUserFirstName = () => {
    if (user?.name) {
      const words = user?.name.split(" ");
      return words[0];
    }
  };

  return (
    <div className="min-w-64 h-screen bg-white text-black flex flex-col border-r">
      <div className="p-4 text-lg font-bold border-b border-green-500">
        Eduwork Marketplace
      </div>
      <div className="p-4 border-b border-green-500">
        <div className="flex items-center">
          <div className="mr-2 bg-green-200 rounded-full w-8 h-8 flex items-center justify-center">
            {getUserTwoFirstWordInitial()}
          </div>
          <span className="mr-1">Hello,</span>
          <Link to="/admin/profile" className="font-bold hover:underline">
            {getUserFirstName()}
          </Link>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-4">
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <FaList className="mr-2" />
          <span className="">All Products</span>
        </NavLink>
        <NavLink
          to="/admin/add-product"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <FaPlus className="mr-2" />
          <span className="">Add Product</span>
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <MdCategory className="mr-2" />
          <span className="">Categories</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <FaShoppingCart className="mr-2" />
          <span className="">Orders</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <FaUsers className="mr-2" />
          <span className="">Users</span>
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            isActive
              ? "flex items-center p-2 rounded cursor-pointer bg-green-100"
              : "flex items-center p-2 rounded cursor-pointer hover:bg-green-200"
          }
        >
          <FaUser className="mr-2" />
          <span className="">My Profile</span>
        </NavLink>

        <div
          className="flex items-center p-2 mt-4 bg-red-600 hover:bg-red-700 cursor-pointer rounded"
          onClick={handleLogout}
        >
          {logoutLoading ? (
            <div className="flex justify-center w-full">
              <FaSpinner className="animate-spin text-white" />
            </div>
          ) : (
            <div className="flex items-center w-full">
              <FaSignOutAlt className="mr-2 text-white" />
              <span className="text-white">Logout</span>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
