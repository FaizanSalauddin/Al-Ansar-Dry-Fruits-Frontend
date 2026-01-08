import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  return adminInfo?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
};

export default AdminProtectedRoute;
