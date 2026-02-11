import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Shield
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  const navItem =
    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300";

  const activeItem =
    "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-100 border-l-4 border-emerald-400";

  const inactiveItem =
    "text-gray-300 hover:text-white hover:bg-white/5 hover:border-l-4 hover:border-white/20";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const mainNavLinks = [
    { to: "/admin", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
    { to: "/admin/products", icon: <Package size={22} />, label: "Products" },
    { to: "/admin/orders", icon: <ShoppingBag size={22} />, label: "Orders" },
    { to: "/admin/users", icon: <Users size={22} />, label: "Users" },
    { to: "/admin/stock-report", icon: <BarChart3 size={22} />, label: "Stock Report" },
  ];

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "null");

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          bg-gradient-to-b from-gray-900 to-gray-950
          border-r border-gray-800
          transition-transform duration-300
          
          w-72
          
          /* Mobile slide */
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* Desktop fixed */
          lg:translate-x-0
          ${isOpen ? "lg:w-72" : "lg:w-0 lg:overflow-hidden"}
        `}
      >
        <div className="w-72 h-full flex flex-col">
          {/* BRAND */}
          <div className="px-6 py-8 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-xl">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Al-Ansar <span className="text-emerald-400">Admin</span>
                </h1>
                <p className="text-xs text-gray-400">Premium Dashboard</p>
              </div>
            </div>
          </div>

          {/* ADMIN INFO */}
          {adminInfo?.admin && (
            <div className="px-6 py-4 border-b border-gray-800">
              <p className="text-white font-semibold">
                {adminInfo.admin.name}
              </p>
              <p className="text-xs text-gray-400">
                {adminInfo.admin.email}
              </p>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
            {mainNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  `${navItem} ${isActive ? activeItem : inactiveItem}`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={20} />
              Logout System
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
