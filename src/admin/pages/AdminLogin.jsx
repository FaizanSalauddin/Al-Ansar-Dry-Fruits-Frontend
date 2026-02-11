import { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { toast } from "react-toastify";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  LogIn,
  Home
} from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminApi.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminInfo", JSON.stringify(data));
      toast.success("Welcome back, Admin!");
      localStorage.removeItem("userInfo");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden px-4 py-6 sm:py-8 md:py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to home button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-3 sm:top-6 left-3 sm:left-6 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 z-10 text-xs sm:text-sm"
      >
        <Home size={16} />
        <span className="hidden xs:inline">Back to Home</span>
        <span className="xs:hidden">Home</span>
      </button>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-[90%] xs:max-w-sm sm:max-w-md md:max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header section with gradient */}
          <div className="bg-gradient-to-r from-emerald-600/30 to-blue-600/30 p-5 sm:p-6 md:p-8 text-center border-b border-white/10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-xl sm:rounded-2xl mb-2 sm:mb-4">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
              Admin Portal
            </h1>
            <p className="text-white/70 text-xs sm:text-sm">
              Secure access to administration dashboard
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={submitHandler} className="p-5 sm:p-6 md:p-8">
            {/* Email field */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-white/60" size={18} />
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="mb-5 sm:mb-6 md:mb-8">
              <label className="block text-white/80 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-white/60" size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/40 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5 sm:mt-2">
                <button
                  type="button"
                  className="text-xs sm:text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                  onClick={() => toast.info("Contact super admin to reset password")}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span className="text-sm sm:text-base">Login to Dashboard</span>
                </>
              )}
            </button>

            {/* Security note */}
            <div className="mt-4 sm:mt-5 md:mt-6 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg">
                  <Shield className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-white/80">
                    This is a secure admin portal. Access is restricted to authorized personnel only.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-5 md:mt-6 text-center">
          <p className="text-white/50 text-xs sm:text-sm">
            © {new Date().getFullYear()} Admin Portal. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-0.5 sm:mt-1">
            Unauthorized access is strictly prohibited
          </p>
        </div>
      </div>

      {/* CSS styles - Moved to a style tag without jsx attribute */}
      <style>
        {`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }

          /* Custom breakpoint for extra small devices */
          @media (min-width: 475px) {
            .xs\\:inline {
              display: inline;
            }
            .xs\\:hidden {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;