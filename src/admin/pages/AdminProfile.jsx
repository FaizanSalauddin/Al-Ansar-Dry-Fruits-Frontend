import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Settings,
  Key,
  Calendar,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  Bell,
  Clock,
  Activity
} from "lucide-react";

function AdminProfile() {
  const [adminInfo, setAdminInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("adminInfo"));
    if (info) {
      setAdminInfo(info);
      setEditData(info.admin);
      fetchAdminStats();
      fetchRecentActivity();
    }
  }, []);

  const fetchAdminStats = async () => {
    // Mock data - replace with actual API call
    setStats({
      totalOrders: 1245,
      pendingOrders: 23,
      totalRevenue: 452890,
      totalUsers: 567
    });
  };

  const fetchRecentActivity = async () => {
    // Mock data - replace with actual API call
    setRecentActivity([
      { id: 1, action: "Updated order status", time: "10 minutes ago", icon: "📦" },
      { id: 2, action: "Added new product", time: "1 hour ago", icon: "🛍️" },
      { id: 3, action: "Processed refund", time: "2 hours ago", icon: "💸" },
      { id: 4, action: "Responded to support ticket", time: "3 hours ago", icon: "💬" },
      { id: 5, action: "Generated monthly report", time: "5 hours ago", icon: "📊" }
    ]);
  };

  const handleSaveChanges = () => {
    // Update admin info in localStorage
    const updatedInfo = {
      ...adminInfo,
      admin: { ...adminInfo.admin, ...editData }
    };
    localStorage.setItem("adminInfo", JSON.stringify(updatedInfo));
    setAdminInfo(updatedInfo);
    setIsEditing(false);
    // Show success toast
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    alert("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = () => {
    confirm("Are you sure you want to logout?") && localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  };

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 h-32"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                      {adminInfo.admin.name.charAt(0)}
                    </div>
                  </div>
                </div>

                <div className="pt-16 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name || ""}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="border-b-2 border-emerald-500 bg-transparent focus:outline-none"
                          />
                        ) : adminInfo.admin.name}
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        <Shield size={12} />
                        ADMIN
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Mail size={16} />
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="border-b-2 border-emerald-500 bg-transparent focus:outline-none"
                        />
                      ) : adminInfo.admin.email}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          Joined {new Date(adminInfo.admin.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-gray-400" />
                        <span className="text-gray-600">Last login: Today</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    {isEditing ? (
                      <>
                        <Check size={18} />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit2 size={18} />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(adminInfo.admin);
                    }}
                    className="mt-4 text-gray-500 hover:text-gray-700 flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* CHANGE PASSWORD */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Key size={20} />
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={!newPassword || !confirmPassword}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;