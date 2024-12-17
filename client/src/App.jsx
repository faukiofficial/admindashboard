import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin";
import AllProducts from "./pages/admin/components/AllProducts";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ActivateAccount from "./pages/auth/activateAcoount";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPasswordActivation from "./pages/auth/ResetPasswordActivation";
import AddProduct from "./pages/admin/components/AddProduct";
import Categories from "./pages/admin/components/Categories";
import EditProduct from "./pages/admin/components/EditProduct";
import { useDispatch, useSelector } from "react-redux";
import { me } from "./redux/user/userSlice";
import { useEffect } from "react";
import { AuthRoute, PrivateRoute } from "./utils/routeProtector";
import AllOrders from "./pages/admin/components/AllOrders";
import AllUsers from "./pages/admin/components/AllUsers";
import MyProfile from "./pages/admin/components/myProfile";
import AuthLayout from "./pages/auth/AuthLayout";

export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-[1000]">
      <div className="rectangular-loader">
        <span>Eduwork</span>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const { user, meLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(me());
  }, [dispatch]);

  if (meLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

        {/* Auth Routes */}
        <Route
          path="/auth/*"
          element={
            <AuthRoute>
              <AuthLayout />
            </AuthRoute>
          }
        >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="activate-account" element={<ActivateAccount />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route
              path="reset-password-activation"
              element={<ResetPasswordActivation />}
            />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <AdminDashboard user={user} />
            </PrivateRoute>
          }
        >
          <Route path="products" element={<AllProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:id" element={<Categories />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
