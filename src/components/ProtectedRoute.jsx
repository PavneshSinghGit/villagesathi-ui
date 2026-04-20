// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.roleId !== 1) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;