import { Navigate, Outlet } from "react-router-dom";

const AdminAuthRedirect = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  return adminInfo?.token ? (
    <Navigate to="/admin" replace />
  ) : (
    <Outlet />
  );
};

export default AdminAuthRedirect;
