import { useState, useEffect } from "react";
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
  ChevronRight,
  Settings,
  Home,
  DollarSign,
  Shield,
  Bell,
  HelpCircle,
  Database,
  TrendingUp,
  PackageCheck,
  UserCheck,
  BarChart,
  Store,
  Grid
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Handle window resize for collapsing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItem = "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden";

  const activeItem = "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-100 border-l-4 border-emerald-400 shadow-lg shadow-emerald-500/10";

  const inactiveItem = "text-gray-300 hover:text-white hover:bg-white/5 hover:border-l-4 hover:border-white/20";

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  // Main navigation links with icons
  const mainNavLinks = [
    { 
      to: "/admin", 
      icon: <LayoutDashboard size={22} />, 
      label: "Dashboard",
      badge: null
    },
    { 
      to: "/admin/products", 
      icon: <Package size={22} />, 
      label: "Products",
      badge: "12"
    },
    { 
      to: "/admin/orders", 
      icon: <ShoppingBag size={22} />, 
      label: "Orders",
      badge: "5"
    },
    { 
      to: "/admin/users", 
      icon: <Users size={22} />, 
      label: "Users",
      badge: null
    },
    { 
      to: "/admin/stock-report", 
      icon: <BarChart size={22} />, 
      label: "Stock Report",
      badge: null
    },
  ];

  // Secondary navigation links
  const secondaryNavLinks = [
    { 
      to: "/admin/analytics", 
      icon: <TrendingUp size={20} />, 
      label: "Analytics",
      badge: null
    },
    { 
      to: "/admin/settings", 
      icon: <Settings size={20} />, 
      label: "Settings",
      badge: null
    },
  ];

  // Get admin info from localStorage
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* DESKTOP COLLAPSE BUTTON */}
      <div className="hidden lg:block fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2.5 bg-emerald-600 text-white rounded-lg shadow-md hover:bg-emerald-700 transition-all hover:scale-105"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} size={20} />
        </button>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-72 lg:w-80 ${isCollapsed ? 'lg:w-20' : ''}
        transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 transition-all duration-300 ease-in-out
        flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800
        shadow-2xl shadow-black/30
      `}>
        
        {/* BRAND SECTION */}
        <div className="relative px-6 py-8 border-b border-gray-800">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <Shield size={28} className="text-white" />
            </div>
            
            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Al-Ansar <span className="text-emerald-400">Admin</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <p className="text-xs text-gray-400 font-medium">
                  Premium Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ADMIN INFO SECTION */}
        {adminInfo?.admin && !isCollapsed && (
          <div className="px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-gray-800/30 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                  {adminInfo.admin.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white truncate">
                  {adminInfo.admin.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {adminInfo.admin.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION CONTAINER */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
          {/* Main Navigation */}
          <div className="px-4 mb-6">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </p>
            )}
            <div className="space-y-1">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin"}
                  className={({ isActive }) =>
                    `${navItem} ${isActive ? activeItem : inactiveItem} ${isCollapsed ? 'justify-center px-0 mx-2' : ''}`
                  }
                >
                  <div className="relative">
                    {link.icon}
                    {link.badge && !isCollapsed && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1">{link.label}</span>
                  )}
                  {!isCollapsed && link.badge && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {!isCollapsed && (
                    <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                      {link.label}
                      {link.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {link.badge}
                        </span>
                      )}
                      <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* LOGOUT SECTION */}
        <div className="p-4 border-t border-gray-800 bg-gradient-to-t from-gray-900/50 to-transparent">
          <button
            onClick={handleLogout}
            className={`group flex items-center ${isCollapsed ? 'justify-center px-0 mx-2' : 'gap-3'} w-full px-4 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500/10 to-red-600/5 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500/50`}
          >
            <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-white/20">
              <LogOut size={20} />
            </div>
            {!isCollapsed && (
              <span className="flex-1 text-left">Logout System</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 border border-gray-700">
                Logout System
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
          
          {!isCollapsed && (
            <div className="mt-3 px-2">
              <p className="text-xs text-gray-500 text-center">
                v2.1.4 • © 2026 Al-Ansar
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(74, 222, 128, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(74, 222, 128, 0.3);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 222, 128, 0.5);
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;