import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute() {
  const {
    isAuthenticated,
    loading
  } = useAuth();


  // Wait while checking saved token
  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }


  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Logged in
  return <Outlet />;
}


export default ProtectedRoute;