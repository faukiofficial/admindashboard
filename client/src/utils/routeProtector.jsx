import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);  
  
    if (!isAuthenticated && !user) {
      return <Navigate to="/auth/login" replace />;
    }
    return <>{children}</>;
  };
  
  export const AuthRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    if (isAuthenticated && user) {
      return <Navigate to="/admin/products" replace />;
    }
    return <>{children}</>;
  };