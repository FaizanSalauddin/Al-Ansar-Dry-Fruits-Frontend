import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { adminLogout } from "../utils/adminLogout";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#F5EFE6]">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50
          top-0 left-0 h-full w-64
          bg-[#2F4F3E] text-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-5 text-xl font-bold border-b border-white/20">
          Admin Panel
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col p-4 gap-3">
          <NavLink
            to="/admin"
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/stock-report"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            Stock Report
          </NavLink>

          {/* ✅ NEW: ADMIN PROFILE */}
          <NavLink
            to="/admin/profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded ${
                isActive
                  ? "bg-white text-[#2F4F3E]"
                  : "hover:bg-white/10"
              }`
            }
          >
            My Profile
          </NavLink>

          {/* ✅ LOGOUT BUTTON */}
          <button
            onClick={() => adminLogout(navigate)}
            className="mt-4 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full">

        {/* TOP BAR (MOBILE) */}
        <div className="md:hidden bg-white shadow px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="text-[#2F4F3E] text-xl"
          >
            ☰
          </button>
          <h1 className="font-bold text-[#2F4F3E]">
            Admin Panel
          </h1>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
