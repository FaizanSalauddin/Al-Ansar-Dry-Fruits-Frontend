import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeItem =
    "bg-[#F5EFE6] text-[#2F4F3E] shadow font-semibold";

  const inactiveItem =
    "text-white/80 hover:bg-white/10 hover:text-white";

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#2F4F3E] text-white min-h-screen shadow-lg">

      {/* LOGO / BRAND */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">
          AL-ANSAR
        </h1>
        <p className="text-xs text-white/60">
          Admin Dashboard
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <Package size={18} />
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <ShoppingBag size={18} />
          Orders
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <Users size={18} />
          Users
        </NavLink>

        <NavLink
          to="/admin/stock-report"
          className={({ isActive }) =>
            `${navItem} ${isActive ? activeItem : inactiveItem}`
          }
        >
          <BarChart3 size={18} />
          Stock Report
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={() => {
            localStorage.removeItem("adminInfo");
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
