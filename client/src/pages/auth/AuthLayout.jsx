import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="p-5 fixed top-0 left-0 right-0 bg-gray-100 border-b shadow-lg">
        <h1 className="text-2xl font-semibold text-green-600">
          Eduwork Marketplace
        </h1>
      </div>
      <Outlet />
    </>
  );
};

export default AuthLayout;
