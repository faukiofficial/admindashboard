import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user); 
    
    // console.log("ini jalan", isAuthenticated, user);
  
    if (!isAuthenticated || !user) {
      console.log("ini jalan jugaa");
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