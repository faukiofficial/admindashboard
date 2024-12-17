import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-[1000]">
      <div className="rectangular-loader">
        <span>Eduwork</span>
      </div>
    </div>
  );
};


export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, meLoading } = useSelector((state) => state.user);

    if (meLoading) {
      return <Loading />;
    }
  
    if (!isAuthenticated && !meLoading) {
      return <Navigate to="/auth/login" replace />;
    }
    return <>{children}</>;
  };
  
  export const AuthRoute = ({ children }) => {
    const { isAuthenticated, meLoading } = useSelector((state) => state.user);
    
    if (meLoading) {
      return <Loading />;
    }

    if (isAuthenticated && !meLoading) {
      return <Navigate to="/admin/products" replace />;
    }
    return <>{children}</>;
  };