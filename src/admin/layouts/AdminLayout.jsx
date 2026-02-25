import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { UserCircle, Menu } from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300
          ${isSidebarOpen ? "lg:ml-72" : "lg:ml-0"}
        `}
      >
        
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 sticky top-0 z-20">

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-2 mr-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-6 ml-auto">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-800">
                Admin Chief
              </p>
              <p className="text-[10px] text-emerald-600 font-medium uppercase">
                Verified Manager
              </p>
            </div>

            <div className="w-10 h-10 bg-[#2F4F3E] rounded-xl flex items-center justify-center text-white">
              <UserCircle
                size={24}
                onClick={() => navigate("/admin/profile")}
                className="cursor-pointer"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
