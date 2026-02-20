import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  // Parse user data safely
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    // Clear invalid data
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required role
  if (role && user.role !== role) {
    // Optional: redirect to appropriate home based on actual role
    if (user.role === "admin") {
      return <Navigate to="/admin/home" replace />;
    }
    return <Navigate to="/user/home" replace />;
  }

  // User is authenticated and authorized
  return children;
}

export default ProtectedRoute;