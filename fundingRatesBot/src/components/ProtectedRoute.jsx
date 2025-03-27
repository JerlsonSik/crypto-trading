import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (!isLoggedIn) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;