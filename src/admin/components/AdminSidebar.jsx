import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItem =
    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group";

  const activeItem =
    "bg-gradient-to-r from-[#F5EFE6] to-white text-[#2F4F3E] shadow-[0_10px_20px_-10px_rgba(245,239,230,0.4)] scale-[1.02]";

  const inactiveItem =
    "text-white/70 hover:bg-white/5 hover:text-white hover:pl-6";

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  };

  const navLinks = [
    { to: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true },
    { to: "/admin/products", icon: <Package size={20} />, label: "Products" },
    { to: "/admin/orders", icon: <ShoppingBag size={20} />, label: "Orders" },
    { to: "/admin/users", icon: <Users size={20} />, label: "Users" },
    { to: "/admin/stock-report", icon: <BarChart3 size={20} />, label: "Stock Report" },
  ];

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#2F4F3E] text-white rounded-lg shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col bg-[#2F4F3E] border-r border-white/10
      `}>
        
        {/* BRAND SECTION */}
        <div className="relative px-8 py-10">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <h1 className="text-2xl font-black tracking-tighter text-white">
            AL<span className="text-[#F5EFE6]">-</span>ANSAR
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">
              Premium Command Center
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeItem : inactiveItem}`
              }
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.label}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT & USER PROFILE SECTION */}
        <div className="p-4 mt-auto border-t border-white/5 bg-black/10">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <div className="p-1.5 bg-red-500/20 rounded-lg group-hover:bg-white/20">
                <LogOut size={18} />
            </div>
            Logout System
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;