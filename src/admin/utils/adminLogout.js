export const adminLogout = (navigate) => {
  localStorage.removeItem("adminInfo");
  navigate("/admin/login");
};