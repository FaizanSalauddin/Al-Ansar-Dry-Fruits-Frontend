import { Outlet, useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar"; // Jo humne abhi banaya tha
import { UserCircle } from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();
  // Sidebar open/close state ab AdminSidebar manage karega ya hum props se bhej sakte hain
  // Filhaal hum layout ko cleaner banane ke liye updated Sidebar use karenge

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* SIDEBAR COMPONENT */}
      {/* Humne jo pehle Futuristic Sidebar banaya tha, wo yahan ayega */}
      <AdminSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* FUTURISTIC TOP BAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 md:px-8 sticky top-0 z-30">

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-3 md:gap-6 ml-auto">

            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  Admin Chief
                </p>
                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-tighter">
                  Verified Manager
                </p>
              </div>

              <div className="w-10 h-10 bg-[#2F4F3E] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/20">
                <UserCircle
                  size={24}
                  onClick={() => navigate("/admin/profile")}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8F9FA]">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8">
            {/* Yahan aapke saare pages (Dashboard, Orders, etc.) load honge */}
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;

