import { useState, useEffect } from "react";
import userApi from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, RefreshCw } from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const [step, setStep] = useState(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  // SEND OTP
  const sendOtp = async () => {
    try {
      if (!email) return toast.error("Please enter email");

      setLoading(true);

      const { data } = await userApi.post("/auth/send-otp", { email });

      setIsNewUser(data.isNewUser);
      setStep(2);

      setTimer(30);
      setCanResend(false);

      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const { data } = await userApi.post("/auth/verify-otp", {
        email,
        otp,
        name: isNewUser ? name : undefined,
      });

      login(data);
      toast.success("Login successful");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] px-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2F4F3E] mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            {step === 1 ? "Enter your email to continue" : "Enter OTP to verify"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {step === 1 && (
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F4F3E] focus:border-[#2F4F3E] outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Send OTP Button */}
              <button
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full bg-[#2F4F3E] text-white py-3.5 rounded-xl font-medium hover:bg-[#243C30] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue with OTP
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* New User Name Input */}
              {isNewUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F4F3E] focus:border-[#2F4F3E] outline-none transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F4F3E] focus:border-[#2F4F3E] outline-none transition-all text-center tracking-widest text-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#2F4F3E] text-white py-3.5 rounded-xl font-medium hover:bg-[#243C30] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={20} />
                    Verifying...
                  </div>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              {/* Resend OTP Section */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {canResend ? "Didn't receive code?" : `Resend code in ${timer}s`}
                  </span>
                  <button
                    onClick={sendOtp}
                    disabled={!canResend || loading}
                    className={`font-medium flex items-center gap-1 ${canResend
                      ? "text-[#2F4F3E] hover:text-[#243C30]"
                      : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <RefreshCw size={16} />
                    Resend OTP
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Step 1 */}
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-center w-full text-sm text-gray-500 hover:text-[#2F4F3E] transition-colors"
            >
              ← Use different email
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;