import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/PrivateRoutes";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>جارٍ التحقق...</div>; // أو Spinner Bootstrap إن حبيت
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
